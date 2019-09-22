var express=require('express');
var router = express.Router();
var mysql = require('mysql');
var config=require('../../config');
var bodyParser = require('body-parser')
var cache = require('memory-cache');
var request = require('request');

// DATABASE SETTING
var connection = mysql.createConnection(config);
connection.connect()

//E-mail발송.
//문자메시지 verificationNumber를 생성하고
router.post('/', (req, res) => {


  session_id=req.user.id;
  phoneNumber = req.body.phoneNumber;
  //인증번호를 key로 하는 캐시가 있다면 삭제(재요청시)
  cache.del(phoneNumber);

  //인증번호 생성.
  verificationNumber=Math.floor(Math.random()*10000000)+1;
  console.log(verificationNumber);

  console.log('phonenumber: '+phoneNumber+",verification:",verificationNumber);

//4분 후에 캐시 삭제
  cache.put(phoneNumber,verificationNumber,180000,(key,value)=>{
      //Time out callback



  });
  console.log(phoneNumber +' verification number is '+cache.get(phoneNumber));




      //http request모듈. http request를 발생시킨다. naver sens에 request발생시킨다.
      request({
      method: 'POST',
      json: true,
      uri: `https://api-sens.ncloud.com/v1/sms/services/ncp:sms:kr:256928778264:yapp_covey/messages`,
      headers: {
        'Content-Type': 'application/json',

  //      'X-NCP-auth-key': process.env.SENS_ACCESSKEYID,
        'X-NCP-auth-key': 'xxxxxx',

  //      'X-NCP-service-secret': process.env.SENS_SERVICESECRET
        'X-NCP-service-secret': 'xxxxxxx'

      },
      body: {
        type: 'sms',
        from: 'xxxxxxx',
        to: [`${phoneNumber}`],
        content: `Covey 가입을 위한 인증번호 ${verificationNumber}입니다.`
      }
    });




  return res.json({ phoneNumber: phoneNumber });
});




//Naverses에서 사용자 핸드폰에 인증번호를 보냈다.
//사용자한테 인증번호와 핸드폰 번호를 입력받는다.
//입력받은 인증번호가 서버의 캐시에 있는지 확인하고 같으면 ok return한다.
router.post('/verify_ans',(req,res)=>{

  session_id = req.user.id;



  phoneNumber=req.body.phoneNumber;
  qur_ans = req.body.qur_ans;

  console.log('verifing 과정====>phoneNumber: '+phoneNumber+",que_ans: "+qur_ans);

  ans = cache.get(phoneNumber);

  console.log("ans==> : ",ans);

  if(qur_ans==ans)
  {
    console.log("phone authorizied");
    var query = connection.query(`update users set phoneNumber_authorized=? where id=?`,[1,session_id],(err,rows)=>{
      if(err) console.error(err);
      res_data= {"phone_Num_verified":"true"}
      res.json(res_data);
    })
  }

    else
  {
    console.log("phone not authorizied");
      res_data= {"phone_Num_verified":"false"}
      res.json(res_data);
  }

})


module.exports = router;
