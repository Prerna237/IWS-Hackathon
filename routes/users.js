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
router.use('/login', function (req, res) {
  if (req.body.userName == undefined) {
    var data = fs.readFileSync(path.join(__dirname, "..", 'public', 'sigin.html'));
    console.log("Data Sent. ");
    res.end(data);
  } else {
    var userDetails = {};
    userDetails.userName = req.body.userName;
    userDetails.password_hash = req.body.password;
    db.checkAuth(userDetails, (status) => {
      switch (status) {
        case _EVENTS.USER_AUTH_SUCCESS:
          req.session.userName = userDetails.userName;
          res.redirect('/profile');
          break;
        case _EVENTS.USER_AUTH_FAIL:
          res.end("You failed miserably Mr. " + userDetails.userName);
          break;
        case _EVENTS.NO_SUCH_USER:
          res.end("You dont exist. Begone.");
          break;
      }
    });
  }
  next();
});

module.exports = router;