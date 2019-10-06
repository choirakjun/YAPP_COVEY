var express=require('express');
var router = express.Router();
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var mysql = require('mysql');
var config=require('../../config');
var bodyParser = require('body-parser')



// EMAIL 구현을 위한 library 설정
var nodemailer = require('nodemailer');
var smtpTransporter=require('nodemailer-smtp-transport');
var crypto = require('crypto');

// DATABASE SETTING
var connection = mysql.createConnection(config);
connection.connect()


var smtpTransport = nodemailer.createTransport(smtpTransporter({
      service: 'Gmail',
      auth: {
          user: 'choirak0805@gmail.com',
          pass: 'crj1179023'
      }
  }));



//인증여부
email_verified ={ type: Boolean, required:true, default: false };
//인증코드
key_for_verify ={ type: String, required:true };


//Client가 자기 대학교이름하고 choirak0805면 choirak0805와 본인이름을 입력한다.
/*
input json
-->
{
  univ: 국민대학교
  email:choirak0805
}
*/
router.post('/',(req,res)=>{


  var client_univ = req.body.univ;
  var client_email_front = req.body.email;

  //사용자가 입력한 대학교 이름과 email을 합쳐서 만들어야 한다.
  client_email='';
  console.log('input client_univ:',client_univ);

  var query = connection.query(`select sc_link_modified from univ where sc_name=? `,[client_univ],(err,rows)=>{
    //console.log('rows: ', rows);
    if(rows)
    {
        client_email=client_email_front+'@'+rows[0].sc_link_modified;
    }
    else {
        client_email='';
    }
    console.log('client_email: ',client_email);

    if(client_email='')
    {
      res.json({"message":"해당하는 대학교 정보가 없습니다."});
    }


    var session_id = req.user.id;

    //같은 이름으로 존재하는 대학교 예를 들어 홍익대학교는 홍익대학교, 홍익대학교_세종캠퍼스 이런식으로 분리해야 한다.
      var query = connection.query (`select key_for_verify from users where id = ?`,[session_id],(err,rows)=>{
        key_for_verify = rows[0].key_for_verify;

          var url = 'http://' + req.get('host')+'/auth/email/confirmEmail'+'?key='+key_for_verify;
                          //옵션
          var mailOpt = {
              from: '########',
              to: client_email,
              subject: '이메일 인증을 진행해주세요.',
              // html : `
              //
              // <h1>이메일 인증을 위해 URL을 클릭해주세요. <a href="'+url+'">'+url+'</a></h1><br>
              //
              // `

              html:`이메일 인증 번호: ${key_for_verify}를 앱 인증 칸에 입력해주세요`
          };

          smtpTransport.sendMail(mailOpt, function(err, res) {
              if (err) {
                  console.log(err);
              } else {
                 console.log('email has been sent.');
              }
            smtpTransport.close();

          });
              //res.json({"message":"메일 확인 메일 보냄"})
            res.json({"message":"이메일 전송 완료하였습니다"."});
            //res.send('<script type="text/javascript">alert("이메일을 확인하세요."); window.location="/"; </script>');
      });



  })

})



//Client가 url 클릭시 인증처리
router.get('/confirmEmail',function (req,res) {

  //session에 저장된 id. (user table의 id랑 같다.)
  var session_id = req.user.id;
  console.log(session_id);

  var query = connection.query (`select key_for_verify from users where id =?`,[session_id],(err,rows)=>{
    ans = rows[0].key_for_verify;

    if(ans == req.query.key)
    {
      var query = connection.query(`update users set email_authorized=? where id =?`,[1,session_id],(err,rows)=>{
        if(err) console.error(err);
        console.log("works right");
        res.json({"email_verified":"success"})
      })

    }
    else {
        console.log("works wrong.");
        res.json({"email_verified":"fail"})

      }
      //redirect

    })
});


/*
input json
-->
{
  key: 사용자가 이메일로 받은 비밀번호
}
*/
router.post('/email_verified',(req,res)=>{

  //session에 저장된 id. (user table의 id랑 같다.)
  var session_id = req.user.id;
  console.log(session_id);

  var query = connection.query (`select key_for_verify from users where id =?`,[session_id],(err,rows)=>{
    ans = rows[0].key_for_verify;

    if(ans == req.body.key)
    {
      var query = connection.query(`update users set email_authorized=? where id =?`,[1,session_id],(err,rows)=>{
        if(err) console.error(err);
        console.log("works right");
        res.json({"email_verified":"success"})
      })

    }
    else {
        console.log("works wrong.");
        res.json({"email_verified":"fail"})

      }
      //redirect

    })

});


module.exports = router;
