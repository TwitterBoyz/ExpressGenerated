var express = require('express');
var router = express.Router();
var _ = require('lodash');

///////////////
//////GET//////
///////////////

/* GET home page. */
router.get('/', function(req, res, next) {
  var allTweets = req.app.locals.tweets;
  var lastTimeStamp = req.app.locals.tweets[0].date;
  if (req.cookies.name){
    if(req.cookies.store){
      console.log("cookie stored");
      console.log(lastTimeStamp);
      res.cookie('name', req.cookies.store);
      res.render('main', {"allTweets": allTweets, "lastTimeStamp": lastTimeStamp});
    }
    else {
      res.render('login');
    }
    //res.render("main", {"allTweets": allTweets});
  }
  else {
    res.render('login');
    console.log("no cookies for you!");
  }
});

router.get('/incognito', function(req, res, next) {
  user_name = "anonymous";
  var allTweets = req.app.locals.tweets;
  res.cookie('name', user_name);
  console.log(req.cookies.secret);
  res.render('incognito', {"allTweets": allTweets});
});
// GET user page
router.get('/user', function( req, res, next) {
  if (req.cookies.name){
  var username = req.cookies.name;
  var message = req.body.message;
  var allTweets = req.app.locals.tweets;
  var info = (_.filter(req.app.locals.userInfo, {'username': username}, 'userInfo'));
  console.log(info);
  var uniqueMessages = (_.filter(allTweets, {"username": username}, 'messages'));
  var index = _.findIndex(req.app.locals.userInfo, function(chr) {
  return chr.username == username;
  });
  console.log("before");
  console.log(info);
    if(index == -1) {
      res.render('user', {"username": username, "uniqueMessages": uniqueMessages});
}
    else {
      console.log("after");
      console.log(info[index]);
      var information = info[index].userInfo;
      res.render('user', {"username": username, "uniqueMessages": uniqueMessages, "info": information});

    }
}
  else {
    res.render('login');
    console.log("no cookies for you!");
  }
});

// GET user profile
router.get('/user/:username', function(req, res, next) {
  var allTweets = req.app.locals.tweets;
  var username = req.cookies.name;
  var user = req.params.username;
  var info = (_.filter(req.app.locals.userInfo, {'username': user}, 'userInfo'));
  var uniqueMessages = (_.filter(allTweets, {"username": user}, 'messages'));
  console.log(user);
  if (req.cookies.name){
    res.render('otherUser', {"username": user, "uniqueMessages": uniqueMessages, "info": info});
}
else {
  res.render('login');
  console.log("no cookies for you!");
}
});

// GET login page
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

// GET signUp page
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

// GET logout page
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


//GET main page
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

// GET delete page - so refresh does not bug out
router.get('/delete', function(req, res, next) {
  var allTweets = req.app.locals.tweets;
  if (req.cookies.name) {
    res.render('main', {"allTweets": allTweets});
  }
  else {
    res.render('login');
    console.log("no cookies for you!");
  }
});

router.get('/posts', function (req, res, next) {
res.json({tweets: req.app.locals.tweets});
res.end("");
});

//GET editUser
router.get('/editUser', function(req, res, next) {
  var username = req.cookies.name;
  var info = (_.filter(req.app.locals.userInfo, {'username': username}, 'userInfo'));
  if (req.cookies.name) {
    res.render('editUser', {"info":info});
  }
  else {
    res.render('user');
  }
});

//GET userProfileInfo
router.get('/addProfile', function(req, res, next) {
res.render('addProfileInfo');
});

router.get('/messages', function(req,res,next){
  var messages = req.app.locals.direct;
  var receiver = req.cookies.name;
  var sender = _.filter(req.app.locals.direct, {"receiver": receiver}, 'sender');
  console.log(sender);
  var uniqueMessages = [];
  for (var i = 0; i < sender.length; i ++) {
  uniqueMessages.push(sender[i]);
}
  res.render('messages', {"messages": uniqueMessages});
});
//////////////////
///// POSTS //////
//////////////////

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
  var age = "age";
  var sex = "sex";
  var location = "location";
  var aboutMe = "about me";
  var user_name = req.body.username;
  var password = req.body.password;
  var objInfo = {'age':age, 'sex':sex, 'location':location, 'aboutMe':aboutMe};
  var obj = {'username': user_name, 'userInfo': objInfo};
  // var tweets = [];
  var date = new Date();
  var allTweets = req.app.locals.tweets;
  var lastTimeStamp = date;
  // for (var i = 0; i < req.app.locals.tweets.length; i ++) {
  // tweets.push(req.app.locals.tweets[i].message);
// }
  if(user_name === undefined || password === undefined) {
    res.render('login');
  }
  if(user_name === "anonymous") {
    res.render('login');
    console.log("YOU CAN'T LOGIN AS THIS!!!");
  }
  if (_.result(_.find(req.app.locals.users, {'username': user_name}), 'password') == password) {
    req.app.locals.userInfo.unshift(obj);
    console.log(req.app.locals.userInfo);

      console.log("Successful Login!");
          res.cookie('name', user_name);
          res.cookie('store', user_name);
          res.render("main", {"allTweets": allTweets, "lastTimeStamp": lastTimeStamp });
    // }
    }
    else {
     console.log("Wrong Username/Password Combination"); // TODO: Make this do alert client
      res.render('login', {"error": "error"});
  }
});

router.post('/logout', function(req, res, next) {
  res.clearCookie('name');
  res.render('login');
});

router.post('/main', function(req, res, next) {
  var username = req.cookies.name;
  var message = req.body.message;
  var date = Date.now();
  var d = new Date();
  var month = parseInt(d.getMonth())+1;
  var time = d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+" on "+month+"/"+d.getDate()+"/"+d.getFullYear();
  req.app.locals.tweets.unshift({"username": username, "message": message, "time": time, "date": date});
  console.log(username);
  var allTweets = req.app.locals.tweets;
  res.render("main", {"allTweets": allTweets});
});


router.post('/userToUser', function(req, res, next) {
  var username = req.cookies.name;
  var message = req.body.message;
  var date = Date.now();
  var d = new Date();
  var month = parseInt(d.getMonth())+1;
  var time = d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+" on "+month+"/"+d.getDate()+"/"+d.getFullYear();
  req.app.locals.tweets.unshift({"username": username, "message": message, "time": time, "date": date});
  var allTweets = req.app.locals.tweets;
  console.log(allTweets);
  res.send("");
});

router.post('/user', function(req, res, next) {
  var age = req.body.age;
  var sex = req.body.sex;
  var location = req.body.locate;
  var aboutMe = req.body.bio;
  var allTweets = req.app.locals.tweets;
  var username = req.cookies.name;
  var message = req.body.message;
  var objInfo = {'age':age, 'sex':sex, 'location':location, 'aboutMe':aboutMe};
  var obj = {'username': username, 'userInfo': objInfo};
  var uniqueMessages = (_.filter(allTweets, {"username": username}, 'messages'));
  var info = (_.filter(req.app.locals.userInfo, {'username': username}, 'userInfo'));
  var index = _.findIndex(req.app.locals.userInfo, function(chr) {
  return chr.username == username;
  });
if (info) {
  //replace old info
    //find where info is
  console.log("info exists");
      //splice old info with new info
  req.app.locals.userInfo.splice(index, 1, obj);
  console.log(req.app.locals.userInfo);
   info = (_.filter(req.app.locals.userInfo, {'username': username}, 'userInfo'));
    res.render('user', {"username": username, "uniqueMessages": uniqueMessages, 'info': info});
}
else {
  //push info into array >>> req.app.locals.userInfo
  req.app.locals.userInfo.push(obj);
  info = (_.filter(req.app.locals.userInfo, {'username': username}, 'userInfo'));
  res.render('user', {"username": username, "uniqueMessages": uniqueMessages, 'info': info});
}
});



router.post('/delete', function(req, res, next) {
  var allTweets = req.app.locals.tweets;
  var username = req.cookies.name;
  if (_.some(allTweets, "username", username)) {
  allTweets.splice(_.findIndex(allTweets, function(chr) {
    return chr.username == username;}),1);
  res.render('main', {"allTweets": allTweets});
  }
  else {
    res.render('main', {"allTweets": allTweets});
  }
});



router.post('/age', function(req, res, next){
  var age = req.body.age;
  var username = req.cookies.name;
  var index = _.findIndex(req.app.locals.userInfo, function(chr) {
  return chr.username == username;
  });
  console.log(index);
  req.app.locals.userInfo[index].userInfo.age = age;
  var info = (_.filter(req.app.locals.userInfo, {'username': username}, 'userInfo'));
  var information = info[index].userInfo;
  res.render('editUser', {"info": information});
});

router.post('/sex', function(req, res, next){
  var sex = req.body.sex;
  var username = req.cookies.name;
  var index = _.findIndex(req.app.locals.userInfo, function(chr) {
  return chr.username == username;
  });
  req.app.locals.userInfo[index].userInfo.sex = sex;
  var info = (_.filter(req.app.locals.userInfo, {'username': username}, 'userInfo'));
  var information = info[index].userInfo;
  res.render('editUser', {"info": information});
});

router.post('/location', function(req, res, next){
  var location = req.body.locate;
  var username = req.cookies.name;
  var index = _.findIndex(req.app.locals.userInfo, function(chr) {
  return chr.username == username;
  });
  req.app.locals.userInfo[index].userInfo.location = location;
  var info = (_.filter(req.app.locals.userInfo, {'username': username}, 'userInfo'));
  var information = info[index].userInfo;
  res.render('editUser', {"info": information});
});

router.post('/about', function(req, res, next){
  var about = req.body.bio;
  var username = req.cookies.name;
  var index = _.findIndex(req.app.locals.userInfo, function(chr) {
  return chr.username == username;
  });
  req.app.locals.userInfo[index].userInfo.aboutMe = about;
  var info = (_.filter(req.app.locals.userInfo, {'username': username}, 'userInfo'));
  var information = info[index].userInfo;
  res.render('editUser', {"info": information});
});



router.post('/addProfile', function(req, res, next) {
  var age = req.body.age;
  var sex = req.body.sex;
  var location = req.body.locate;
  var aboutMe = req.body.bio;
  var username = req.cookies.name;
  var allTweets = req.app.locals.tweets;
  var objInfo = {'age':age, 'sex':sex, 'location':location, 'aboutMe':aboutMe};
  var obj = {'username': username, 'userInfo': objInfo};
  var uniqueMessages = (_.filter(allTweets, {"username": username}, 'messages'));
  console.log(req.app.locals.userInfo);
  var info = (_.filter(req.app.locals.userInfo, {'username': username}, 'userInfo'));
  res.render('user', {"info": info});
  var index = _.findIndex(req.app.locals.userInfo, function(chr) {
  return chr.username == username;
  });
  if (info) {
    console.log("info exists");
    req.app.locals.userInfo.splice(index, 1, obj);
    console.log(req.app.locals.userInfo);
     info = (_.filter(req.app.locals.userInfo, {'username': username}, 'userInfo'));
      res.render('user', {"username": username, "uniqueMessages": uniqueMessages, 'info': info});
  }
  else {
    //push info into array >>> req.app.locals.userInfo
    req.app.locals.userInfo.push(obj);
    info = (_.filter(req.app.locals.userInfo, {'username': username}, 'userInfo'));
    res.render('user', {"username": username, "uniqueMessages": uniqueMessages, 'info': info});
  }

});

router.post('/backToUser', function(req,res,next) {
  var age = req.body.age;
  var sex = req.body.sex;
  var location = req.body.locate;
  var aboutMe = req.body.bio;
  var username = req.cookies.name;
  var allTweets = req.app.locals.tweets;
  var objInfo = {'age':age, 'sex':sex, 'location':location, 'aboutMe':aboutMe};
  var obj = {'username': username, 'userInfo': objInfo};
  var info = (_.filter(req.app.locals.userInfo, {'username': username}, 'userInfo'));
  var uniqueMessages = (_.filter(allTweets, {"username": username}, 'messages'));
  var index = _.findIndex(req.app.locals.userInfo, function(chr) {
  return chr.username == username;
  });
  console.log(info);
  if (info.length) {
    console.log("info exists");
    req.app.locals.userInfo.splice(index, 1, obj);
    var information = info[index].userInfo;
     info = (_.filter(req.app.locals.userInfo, {'username': username}, 'userInfo'));
      res.render('user', {"username": username, "uniqueMessages": uniqueMessages, 'info': information});
  }
  else {
    //push info into array >>> req.app.locals.userInfo
    req.app.locals.userInfo.unshift(obj);
    info = (_.filter(req.app.locals.userInfo, {'username': username}, 'userInfo'));
    infor = info[0].userInfo;
    res.render('user', {"username": username, "uniqueMessages": uniqueMessages, 'info': infor});
  }
});

router.post('/update', function(req,res,next){
  res.send('hello');
});

router.post('/directMessage', function(req,res,next) {
  var sender = req.cookies.name;
  var receiver = req.body.username;
  var message = req.body.message;
  var date = Date.now();
  var d = new Date();
  var month = parseInt(d.getMonth())+1;
  var time = d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+" on "+month+"/"+d.getDate()+"/"+d.getFullYear();
  var obj = {"sender": sender, "receiver": receiver, "message": message, "time": time};
  req.app.locals.direct.unshift(obj);
  res.render('user');
});


module.exports = router;
