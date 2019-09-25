//JSON 형태 URL : www.career.go.kr/cnet/openapi/getOpenApi.json?apiKey=a606ed657920106109016d33ee0f96a4

var express=require('express');
var router = express.Router();
var mysql = require('mysql');
var config=require('../config');
var bodyParser = require('body-parser')
var cache = require('memory-cache');
var request = require('request');

// DATABASE SETTING
var connection = mysql.createConnection(config);
connection.connect()


//query문
    // var query = connection.query(`update users set phoneNumber_authorized=? where id=?`,[1,session_id],(err,rows)=>{
    //   if(err) console.error(err);
    //   res_data= {"phone_Num_verified":"true"}
    //   res.json(res_data);
    // })



router.get('/test',(req,res)=>{


  var query = connection.query(`select id,sc_name,sc_link from univ where length(sc_link_modified)<5 `,(err,rows)=>{



    console.log(rows);


      if(rows)
      {
        //data 존재할때

        cycle=rows.length;
        for(i=0;i<cycle;i++)
        {
            if(rows[i].sc_link!='null'){
              console.log(rows[i].sc_link);
              id=rows[i].id;
        //      console.log(rows[i].sc_name, rows[i].sc_link);
              link = rows[i].sc_link;

                len = link.length;
                link=link.substr(7,len-1);
    //            console.log(link)


                end = link.indexOf('kr');

                link=link.substr(0,end+2);
                console.log(link);

                var query  = connection.query (`update univ set sc_link_modified=? where id =?`,[link,id],(err,rows)=>{

                    console.log(rows);

                })

            }

        }




  }


  })

})



router.get('/',(req,res)=>{

/*
www.career.go.kr/cnet/openapi/getOpenApi?apiKey=a606ed657920106109016d33ee0f96a4&svcType=api&svcCode=SCHOOL&contentType=json&gubun=univ_list&sch1=100323


*/
  request.get('https://www.career.go.kr/cnet/openapi/getOpenApi?apiKey=a606ed657920106109016d33ee0f96a4&svcType=api&svcCode=SCHOOL&contentType=json&gubun=univ_list&perPage=500',(err,res,body)=>{

//https://www.career.go.kr/cnet/openapi/getOpenApi?apiKey=a606ed657920106109016d33ee0f96a4&svcType=api&svcCode=SCHOOL&contentType=json&gubun=univ_list
    // console.log(body);


    // console.log(body);


    response = JSON.parse(body);

    len =response['dataSearch']['content'][0].totalCount;


    console.log('======================================')    // response = JSON.parse(body);
    console.log('len: ',len);


      // var query = connection.query(`update users set phoneNumber_authorized=? where id=?`,[1,session_id],(err,rows)=>{

      //
      for(i=0;i<len;i++){


//      console.log(response['dataSearch']['content'][i].schoolName,response['dataSearch']['content'][i].link.substr(11,).substr(,));

      sc_name = response['dataSearch']['content'][i].schoolName;
      sc_link=response['dataSearch']['content'][i].link;
      // console.log(typeof(sc_link));
      // console.log(sc_name, sc_link);
      //
      // console.log(sc_link);
      // // console.log(sc_len);
      // // sc_len = sc_link.length;
      // // sc_link=response['dataSearch']['content'][i].link.substr[11,sc_len];
      // // sc_len = sc_link.length;
      // //
      // // sc_link = sc_link.substr(0,sc_len-6+1);
      // // console.log(sc_name, sc_link)
      // // sc_link=
      // var query = connection.query(`insert into univ(sc_name, sc_link) values (?,?) `,[sc_name,sc_link],(err,rows)=>{
      //     console.log(err);
      //
      // });
      //
        //sc_name
        //sc_link

    }

      console.log();

//    console.log(response['dataSearch']['content']);
  });
});

module.exports = router;
