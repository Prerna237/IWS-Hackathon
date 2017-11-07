'use strict'

var express = require('express');
var fs = require('fs');
var path = require('path');
var _Emitter = require('../lib/EventEmitter');
var _EVENTS = require('../lib/Constants')._EVENTS;
var db = require('../lib/DB');

var router = express.Router();

router.get('/', (req, res, next) => {
  next();
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
    var userDetails = {};
    userDetails.userName = req.body.userName;
    userDetails.password_hash = req.body.password;
    console.log("Checking Auth :" + JSON.stringify(userDetails));
    db.checkAuth(userDetails, (status) => {
      console.log("Called with status: " + status);
      if (status === _EVENTS.USER_ADD_SUCCESS) {
        req.session.userName = userDetails.userName;
        console.log("User Authentication successful");
        return res.redirect('/profile');
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

module.exports = router;