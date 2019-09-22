var express=require('express');
var router = express.Router();
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var mysql = require('mysql');
var config=require('../../config');

// EMAIL 구현을 위한 library 설정
var nodemailer = require('nodemailer');
var smtpTransporter=require('nodemailer-smtp-transport');
var crypto = require('crypto');

// DATABASE SETTING
var connection = mysql.createConnection(config);
connection.connect()


//passport_face_book router
var face_book_auth = require('./facebook');





router.get('/',(req,res)=>{
  var obj = {
    "name":"choirakjun",
    "address":"seoul"

  }


  res.json(obj);


})











module.exports = router;
