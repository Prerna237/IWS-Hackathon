'use strict'

var express = require('express');
var fs = require('fs');
var path = require('path');
var _Emitter = require('../lib/EventEmitter');
var _EVENTS = require('../lib/Constants')._EVENTS;

var _DB = require(__dirname,'..', 'lib', 'Constants.js')._DB;

console.log("DBer: "+_DB);

var router = express.Router();

router.get('/', (req, res, next) => {
  next();
});

/* GET users listing. */
router.use('/login', function (req, res, next) {
  if (req.body.userName == undefined) {
    var data = fs.readFileSync(path.join(__dirname,".." ,'public', 'sigin.html'));
    console.log("Data Sent. ");
    res.end(data);
  } else {
    var userDetails = {};
    userDetails.userName = req.body.userName;
    userDetails.password_hash = req.body.password;
    
    // _Emitter.emit(_EVENTS.CHECK_USER_AUTH, userDetails);

    // _Emitter.on(_EVENTS.USER_AUTH_SUCCESS, () => {
    //   // res.end("Successfully logged in. Mr. " + userDetails.userName);
    //   req.session.userName = userDetails.userName;
    //   res.redirect('/profile');
    //   next();
    // });
    // _Emitter.on(_EVENTS.USER_AUTH_FAIL, () => {
    //   res.end("You failed miserably Mr. "+ userDetails.userName);
    // });
    // _Emitter.on(_EVENTS.NO_SUCH_USER, () => {
    //   res.end("You dont exist. Begone.");
    // });
    
  }
  next();
});

module.exports = router;