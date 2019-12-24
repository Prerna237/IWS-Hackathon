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
  if (req.session.userName) {
    console.log("Trying to signup. Already logged in " + req.session.userName);
    res.redirect('/');
  } else {
    if (req.method) {
      console.log("Sending signup page.");
      res.end(pageHandlers.signUpPage());
    } else {
      var ud = res.body;
      db.addUser(req.body, (status) => {
        if (status == _EVENTS.USER_ADD_ERR) {
          res.end("Error");
        } else if (status.status === 'Failure') {
          console.log("Sending Failure");
          res.end(JSON.stringify({
            status: 'Failure'
          }));
        } else {
          console.log("Redirecting to profile");
          req.session.userName = req.body.userName;
          req.session.moderator = false;
          req.session.interests = req.body.interests;
          res.redirect('/profile');
        }
      });
    }
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
        res.cookie('loginStatus', 'SUCCESS');
        if (req.body.samePage) {
          console.log("In SamePage");
          return res.redirect(req.headers.referer);
        } else {
          return res.redirect('/profile');
        }
      } else if (status === _EVENTS.USER_AUTH_FAIL) {
        console.log("User Authentication Failed");
        // return res.end("You failed miserably Mr. " + userDetails.userName);
        res.cookie('loginStatus', 'FAIL');
        return res.redirect(req.headers.referer);
      } else {
        console.log("NO SUCH USER");
        res.cookie('loginStatus', 'NO_USER');
        // return res.end("You dont exist. Begone.");
        return res.redirect(req.headers.referer);
      }
    });
  }
  // next();
});

router.use('/logout', (req, res) => {
  delete req.session.userName;
  res.redirect('/');
});

module.exports = router;