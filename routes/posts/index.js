var express=require('express');
var router = express.Router();
var multer = require('multer');
var mysql = require('mysql');
var config=require('../../config');
var bodyParser = require('body-parser')
var path = require('path');

// DATABASE SETTING
var connection = mysql.createConnection(config);
connection.connect()



//due data랑 비교해서 table삭제
router.get('/process_due_posts', function (req, res){


    var query = connection.query(`delete * from Posts  where dueDate < NOW()`,(err,rows)=>{

      if(err) console.error(err);

    })

});


//input: post_id:xxx !!postid입력하면 해당 post삭제한다.
router.post('/close_post',(req,res)=>{


  //
  id=req.body.id;
  var query = connection.query(`delete from Posts where id=?`,[id],(err,rows)=>{
    if(err)res.json({"deleted":fail});
    else
    {
        res.json({"deleted":success});
    }

  });

});




//즐겨찾기 누를경우. 사용자가 선택한 post 테이블 선택
//input==> {"postId":xx}
router.post('/enroll_favorites',(req,res)=>{

  user_id=req.user.id;
  post_id=req.body.postId;


  var query = connection.query(`insert into good(post_id,user_id) values ('${post_id}','${user_id}')`,(err,rows)=>{

    if(err) {
      console.error(err);
      res.json({"result":"fail"});
    }
    else{
      res.json({"result":"success"});
    }

  })
})

//즐겨찾기 다시 누를경우(즐겨찾기 해제)
//input==> {"postId":xx}
router.post('/cancel_favorites',(req,res)=>{

//  user_id=req.user.id;
  user_id=5;
  post_id=req.body.postId;


  var query = connection.query(`delete from good where user_id='${user_id}' and post_id='${post_id}'`,(err,rows)=>{

    if(err) {
      console.error(err);
      res.json({"result":"fail"});
    }
    else{
      res.json({"result":"success"});
    }

  })
})



//사용자가 누른 전체 즐겨찾기 postid 출력
router.get('/user_favorites',async (req,res)=>{

  user_id=req.user.id;
  list_post_Id=[]

  query = connection.query(`select post_id from good where user_id=${user_id}`,(err,rows)=>{

    if(err) {
      console.error(err);
      res.json({"result":"fail"});
    }
    else{
      console.log(rows);
      list=[]
      len = rows.length;
      for(var i=0;i<len;i++)
      {
        //title startDate   endDate
        post_Id=rows[i].post_id;
        //console.log(post_Id);
        list_post_Id[i]=post_Id;

      }
    }
  })

    //lsit_post_id에는 해당 사용자가 즐겨찾기한 postid 들의 리스트가 저장되어있음
    //그리고 밑에서 리스트들을 돌면서 각 포스트의 title,startaate,enddate를 출력함
  console.log("list_post_id",list_post_Id.length);
      for (var i=0;i<list_post_Id.length;i++){
          var query = connection.query(`select title,startDate,endDate  from posts where id=${list_post_Id[i]}`,(err,rows)=>{
            console.log("시작");
            title=rows[i].title;
            startDate=rows[i].startDate;
            endDate=rows[i].endDate;
            list[i]=
            {
                "title":title,
                "startDate":startDate,
                "endDate":endDate
            }
          });

          res.json(list);

      }
    });


module.exports = router;
