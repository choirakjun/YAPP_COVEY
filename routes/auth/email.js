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


//E-mail에서는 request.user.id 이용해서 세션을 이용해서 email인증 확인


//EMAIL 구현
// var nodemailer = require('nodemailer');
// var smtpTransporter=require('nodemailer-smtp-transport');
// var crypto = require('crypto');



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
  name: 본인이름
}


*/
router.post('/',(req,res)=>{


  var client_univ = req.body.univ;

  var client_email_front = req.body.email;
  client_email='';
  console.log('input client_univ:',client_univ);

  var query = connection.query(`select sc_link_modified from univ where sc_name=? `,[client_univ],(err,rows)=>{
    console.log('rows: ', rows);
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
      res.json({"message":"email_인증번호가 없습니다."});
    }

  //  var client_name = req.body.name;

  //  console.log(client_email, client_name);

    var session_id = req.user.id;
    console.log(session_id);



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
            res.send('<script type="text/javascript">alert("이메일을 확인하세요."); window.location="/"; </script>');
      });



  })
//   console.log('client_email: ',client_email);
//   if(client_email='')
//   {
//     res.json({"message":"email_인증번호가 없습니다."});
//   }
//
// //  var client_name = req.body.name;
//
// //  console.log(client_email, client_name);
//
//   var session_id = req.user.id;
//   console.log(session_id);

//
// //같은 이름으로 존재하는 대학교 예를 들어 홍익대학교는 홍익대학교, 홍익대학교_세종캠퍼스 이런식으로 분리해야 한다.
//   var query = connection.query (`select key_for_verify from users where id = ?`,[session_id],(err,rows)=>{
//     key_for_verify = rows[0].key_for_verify;
//
//       var url = 'http://' + req.get('host')+'/auth/email/confirmEmail'+'?key='+key_for_verify;
//                       //옵션
//       var mailOpt = {
//           from: 'choirak0805@google.com',
//           to: client_email,
//           subject: '이메일 인증을 진행해주세요.',
//           // html : `
//           //
//           // <h1>이메일 인증을 위해 URL을 클릭해주세요. <a href="'+url+'">'+url+'</a></h1><br>
//           //
//           // `
//
//           html:`이메일 인증 번호: ${key_for_verify}를 앱 인증 칸에 입력해주세요`
//       };
//
//       smtpTransport.sendMail(mailOpt, function(err, res) {
//           if (err) {
//               console.log(err);
//           } else {
//              console.log('email has been sent.');
//           }
//         smtpTransport.close();
//
//       });
//           //res.json({"message":"메일 확인 메일 보냄"})
//         res.send('<script type="text/javascript">alert("이메일을 확인하세요."); window.location="/"; </script>');
//   });
//


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
        res.json({"email_verified":"ok"})
      })

    }
    else {
        console.log("works wrong.");
        res.json({"email_verified":"false"})

      }
      //redirect

    })
});


//이메일 인증 됐는지 확인 할 수 있는 코드--> yes/ no
//사용자가 입력한 인증번호를 보내줘야 한다. key:~~
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
        res.json({"email_verified":"ok"})
      })

    }
    else {
        console.log("works wrong.");
        res.json({"email_verified":"false"})

      }
      //redirect

    })

});






  // User.updateOne({key_for_verify:req.query.key},{$set:{email_verified:true}}, function(err,user){
  //     //에러처리
  //     if (err) {
  //         console.log(err);
  //     }
  //     //일치하는 key가 없으면
  //     else if(user.n==0){
  //         res.send('<script type="text/javascript">alert("Not verified"); window.location="/"; </script>');
  //     }
  //     //인증 성공
  //     else {
  //         res.send('<script type="text/javascript">alert("Successfully verified"); window.location="/"; </script>');
  //     }
  // });
  //








module.exports = router;
