'use strict'

var express = require('express');
var fs = require('fs');
var path = require('path');
var io = require('socket.io');
var _Emitter = require('../lib/EventEmitter');
var _EVENTS = require('../lib/Constants')._EVENTS;
var db = require('../lib/DB');
var pageHandlers = require('../lib/handles');

var router = express.Router();

router.get('/', (req, res, next) => {
  next();
});

// Sign up
router.use('/signup', (req, res) => {
  if (req.method) {
    console.log("Sending signup page.");
    res.end(pageHandlers.signUpPage());
  } else {
    var ud = res.body;
    db.addUser(req.body, (status) => {
      if (status == _EVENTS.USER_ADD_ERR) {
        res.end("Error");
      } else {
        req.session.userName = req.body.userName;
        req.session.moderator = false;
        req.session.interests = req.body.interests;
        res.redirect('/profile');
      }
    });
  }
});

/* GET users listing. */
router.use('/login', function (req, res, next) {
  console.log(req.body);
  if (req.body.userName == undefined) {
    // var data = fs.readFileSync(path.join(__dirname, "..", 'public', 'sigin.html'));
    // console.log("Data Sent. ");
    // res.end(data);
    res.redirect('/profile');
  } else {
    console.log('Login request');
    var userDetails = {};
    userDetails.userName = req.body.userName;
    userDetails.password = req.body.password;
    console.log("Checking Auth :" + JSON.stringify(userDetails));
    db.checkAuth(userDetails, (status, user) => {
      console.log("Called with status: " + status);
      if (status === _EVENTS.USER_ADD_SUCCESS) {
        req.session.userName = userDetails.userName;
        req.session.moderator = (user.profile_type === 'moderator');
        req.session.interests = user.interests;
        // console.log('UserName: ' + req.session.userName + " type: " + req.session.moderator);
        console.log("User Authentication successful: " + req.body.samePage);
        if (req.body.samePage) {
          console.log("In SamePage");
          return res.redirect(req.headers.referer);
        } else {
          return res.redirect('/profile');
        }
      } else if (status === _EVENTS.USER_AUTH_FAIL) {
        console.log("User Authentication Failed");
        return res.end("You failed miserably Mr. " + userDetails.userName);
      } else {
        console.log("NO SUCH USER");
        return res.end("You dont exist. Begone.");
      }
    });
  }
  // next();
});

router.use('/logout', (req, res) => {
  delete req.session.userName;
  res.redirect('/');
});

router.get('/profile/:userName', (req, res) => {
  var userName = req.params.userName;
  if (userName) {
    db.getUser(userName, (user) => {
      res.end(pageHandlers.userProfile({
        userName: user.userName,
        email: user.email,
        name: user.name,
        dateJoin: user.dateJoin,
        userRating: user.rating,
        starsGiven: user.ratings.length,
        starsRecv: user.numRatings,
        numThreads: user.threads.length,
        numReplies: user.replies.length,
        accountType: user.profile_type
      }));
    });
  }
});

module.exports = router;