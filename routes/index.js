var express = require('express');
var router = express.Router();
var app = express();
var _ = require('lodash');
var $ = require('jquery');
var allTweets = app.locals.tweets;
/* GET home page. */
router.get('/', function(req, res, next) {
  // var name = req.params.username;
  // res.cookie('user', name);
  if (req.cookies.name){
  res.render('main');
  console.log(req.cookies);

}
  else {
    res.render('login');
    console.log("no cookies for you!");
  }
});

router.get('/user:name?', function( req, res, next) {
  var username = req.cookies.name;
  var message = req.body.message;
  req.app.locals.tweets.push({"username": username, "message": message});
  var tweets = [];
  for (var i = 0; i < req.app.locals.tweets.length; i ++) {
  tweets.push(req.app.locals.tweets[i].message);
}
  res.render('user', {"username": username, "messages": tweets });
});
router.get('/login', function(req,res,next) {
  console.log("you have accessed login page");
  res.render('login');
});

router.get('/signUp', function(req, res, next) {
  console.log("you have accessed signUp page");
  res.render('signUp');
});

router.get('/logout', function(req, res, next) {
  console.log("you are about to log out");
  res.render('logout');
});

router.get('/tweet', function(req, res, next) {
  console.log("you are about to tweet");
  res.render("tweet");
});

router.get('/main', function(req, res, next) {
  var username = req.cookies.name;
  var messages = allTweets;
  res.render("main", {"username": username, "message": messages});
});


router.post('/signUp', function(req, res, next) {
  console.log("switching to signUp");
  res.render('signUp');
});

router.post('/login', function(req, res, next) {
  console.log("switching to login");
  var user_name = req.body.username;
  var password = req.body.password;
  console.log(user_name);
    if (_.some(req.app.locals.users, "username", user_name)){
        console.log("User already exists");
          res.render("signUp");
    }
      else {
      req.app.locals.users.push({"username": user_name, "password":password});
      // app.locals.passwords.push(password);
      console.log(req.app.locals.users);
      res.render("login");
    }
});

router.post('/', function(req, res, next) {
  var user_name = req.body.username;
  var password = req.body.password;
  // req.app.locals.tweets.push({"username": user_name, "message": message});
  var tweets = [];
  for (var i = 0; i < req.app.locals.tweets.length; i ++) {
  tweets.push(req.app.locals.tweets[i].message);
}
  if(user_name === undefined || password === undefined) {
    res.render('login');
  }
  if (_.some(req.app.locals.users, "username", user_name)) {
  if (_.some(req.app.locals.users, "password", password)) {
      console.log("Successful Login!");
          res.cookie('name', user_name);
          res.render("main", {"message": tweets});
    }
    }
    else {
     console.log("Wrong Username/Password Combination");
      res.render('login');
  }
});

router.post('/logout', function(req, res, next) {
  res.clearCookie('name');
  res.render('login');
});

router.post('/main', function(req, res, next) {
  var username = req.cookies.name;
  var message = req.body.message;

  req.app.locals.tweets.push({"username": username, "message": message});
  var tweets = [];
  for (var i = 0; i < req.app.locals.tweets.length; i ++) {
  tweets.push(req.app.locals.tweets[i].message);
}
  console.log(req.app.locals.tweets);
  res.render("main", {message: tweets});
});
module.exports = router;
