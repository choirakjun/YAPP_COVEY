var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  console.log('/users에서 req.user');
  console.log(req.user);
});

module.exports = router;
