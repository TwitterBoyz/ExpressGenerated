var express = require('express');
var router = express.Router();
var app = express();


/* GET home page. */
router.get('/:username?', function(req, res, next) {
  var name = req.params.username;
  console.log(req.app.locals.users);
  res.cookie('user', name);
  res.render('index', { title: 'Twitter Rip Off' });
});

router.post('/signUp', function(req, res, next) {
  res.render('signUp');
});

router.post('/login', function(req, res, next) {
  res.render('login');
});
module.exports = router;
