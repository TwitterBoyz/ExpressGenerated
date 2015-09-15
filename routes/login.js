var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
  console.log("login page!");
  res.render('login');
});

router.post('/login', function(req, res, next) {
  res.render('login');
});

module.exports = router;
