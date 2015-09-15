var express = require('express');
var router = express.Router();
var app = express();


/* GET home page. */
router.get('/:username?', function(req, res, next) {
  var name = req.params.username;
  console.log(app.locals.users);
  res.cookie('user', name);
  console.log(req.cookies.remember);
  res.render('index', { title: 'Twitter Rip Off' });
});

router.post('/login', function(req, res, next) {
  res.render('login', { title: 'Login Page'});
});
module.exports = router;
