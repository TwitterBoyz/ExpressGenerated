var express = require('express');
var router = express.Router();
var _ = require('lodash');

/* GET home page. */
router.get('/', function(req, res, next) {
  var allTweets = req.app.locals.tweets;
  if (req.cookies.name){
  res.render("main", {"allTweets": allTweets});}
  else {
    res.render('login');
    console.log("no cookies for you!");
  }
});

router.get('/user', function( req, res, next) {
  if (req.cookies.name){
  var username = req.cookies.name;
  var message = req.body.message;
  var allTweets = req.app.locals.tweets;
  var uniqueMessages = (_.filter(allTweets, {"username": username}, 'messages'));
  var ownMessages = [];
  for (var k = 0; k < uniqueMessages.length; k ++) {
    ownMessages.push(uniqueMessages[k].message);
  }
  res.render('user', {"username": username, "ownMessages": ownMessages});
}
  else {
    res.render('login');
    console.log("no cookies for you!");
  }
});

router.get('/login', function(req,res,next) {
  var allTweets = req.app.locals.tweets;
  if (req.cookies.name){
  res.render('main', {"allTweets": allTweets});
  console.log("you have accessed login page");
}
  else {
    res.render('login');
    console.log("no cookies for you!");
  }
});

router.get('/signUp', function(req, res, next) {
  if (req.cookies.name){
  console.log("you have accessed signUp page");
  res.render('signUp');
}
  else {
    res.render('login');
    console.log("no cookies for you!");
  }
});

router.get('/logout', function(req, res, next) {
  if (req.cookies.name){
  console.log("you are about to log out");
  res.render('logout');
}
  else {
    res.render('login');
    console.log("no cookies for you!");
  }
});

router.get('/tweet', function(req, res, next) {
  console.log("you are about to tweet");
  res.render("tweet");
});

router.get('/main', function(req, res, next) {
  if (req.cookies.name){
  var username = req.cookies.name;
  var allTweets = req.app.locals.tweets;
  res.render("main", {"allTweets": allTweets});
}
  else {
    res.render('login');
    console.log("no cookies for you!");
  }
});


router.post('/signUp', function(req, res, next) {
  console.log("switching to signUp");
  res.render('signUp');
});

router.post('/login', function(req, res, next) {
  console.log("switching to login");
  var user_name = req.body.username;
  var password = req.body.password;
  // console.log(user_name);
    if (_.some(req.app.locals.users, "username", user_name)){
        console.log("User already exists");
          res.render("signUp");
    }
      else {
      req.app.locals.users.push({"username": user_name, "password":password});
      console.log(req.app.locals.users);
      res.render("login");
    }
});

router.post('/', function(req, res, next) {
  var user_name = req.body.username;
  var password = req.body.password;
  var tweets = [];
  var allTweets = req.app.locals.tweets;
  for (var i = 0; i < req.app.locals.tweets.length; i ++) {
  tweets.push(req.app.locals.tweets[i].message);
}
  if(user_name === undefined || password === undefined) {
    res.render('login');
  }
  if (_.result(_.find(req.app.locals.users, {'username': user_name}), 'password') == password) {
  // if (_.some(req.app.locals.users, "password", password)) {
      console.log("Successful Login!");
          res.cookie('name', user_name);
          res.render("main", {"allTweets": allTweets});
    // }
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
  var allTweets = req.app.locals.tweets;
  console.log(_.sortByOrder(allTweets), 'time', 'desc');
  var d = new Date();
  var month = parseInt(d.getMonth())+1;
  var time = d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+" on "+month+"/"+d.getDate()+"/"+d.getFullYear();
  req.app.locals.tweets.unshift({"username": username, "message": message, "time": time});
  var tweets = [];
  for (var i = 0; i < req.app.locals.tweets.length; i ++) {
  tweets.push(req.app.locals.tweets[i].message);
}
  console.log(req.app.locals.tweets);
  res.render("main", {"allTweets": allTweets});
});

router.post('/user', function(req, res, next) {
 var allTweets = req.app.locals.tweets;
 var username = req.cookies.name;
 var message = req.body.message;
 var uniqueMessages = (_.filter(allTweets, {"username": username}, 'messages'));
 res.render('user', {"username": username, "uniqueMessages": uniqueMessages});
});

router.post('/delete', function(req, res, next) {
var allTweets = req.app.locals.tweets;
var username = req.cookies.name;
if (_.some(allTweets, "username", username)) {
allTweets.splice(0,1);
res.render('main', {"allTweets": allTweets});
}
else {
  res.render('main', {"allTweets": allTweets});
}
});
module.exports = router;
