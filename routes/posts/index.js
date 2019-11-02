var express=require('express');
var router = express.Router();
var multer = require('multer');
var mysql = require('mysql');
var config=require('../../config');
var bodyParser = require('body-parser')
var Q = require('Q');
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

};
//SELECT * FROM download WHERE expiry_date > NOW()



//input: post_id:xxx
router.post('/close_post',function(req,res)=>{


  //
  id=req.body.id;
  var query = connection.query(`delete from Posts where id=?`,[id],(err,rows)=>{
    if(err)res.json({"deleted:fail"});
    else
    {
        res.json({"deleted:success"});
    }

  });

});

module.exports = router;
