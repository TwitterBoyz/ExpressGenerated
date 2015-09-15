var express = require('express');
var router = express.Router();
var _ = require('lodash');

/* GET login page. */
router.get('/', function(req, res, next) {
    console.log(req.app.locals.users);
  res.render('signUp', { title: 'Sign Up Page' });
});

router.post('/login', function(req, res, next) {
  var user_name = req.body.username;
  var password = req.body.password;
  console.log(req.app.locals.users);
  // console.log(user_name);
  // console.log(password);
    if (_.some(req.app.locals.users, "username", user_name)){
        console.log("User already exists");
        console.log(req.app.locals.users);
          res.render("signUp");
    }
      else {
      req.app.locals.users.push({"username": user_name, "password":password});
      // app.locals.passwords.push(password);
      console.log(req.app.locals.users);
      res.render("signUp");
    }
  console.log(req.app.locals.users);
  // res.render('signUp');
});


module.exports = router;
