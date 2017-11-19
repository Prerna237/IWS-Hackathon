'use strict'

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var pageHandlers = require('./lib/handles');

var _Emitter = require('./lib/EventEmitter');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
// var DB = require('./lib/DB');
const db = require('./lib/DB');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// ======== Express Work ========== //

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // Have to remove this.
app.use(session({
    secret: 'Secret',
    saveUninitialized: false,
    resave: false
}));

// ======= Authentication setup ======== //

// Username setup in Cookie
app.use('/', (req, res, next) => {
    // console.log("OrigURL: " + req.headers.referer);
    console.log("Status: " + req.statusCode);
    if (req.session.userName) {
        // res.setHeader("userName", req.session.userName);
        console.log('Cookie set.');
        res.cookie("userName", req.session.userName);
        res.cookie("interests", req.session.interests);
        console.log("Interests: " + req.session.interests);
    } else {
        res.clearCookie('userName');
    }
    next();
});

// ======= Routes setup ======== //

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
    console.log('Referer: ' + req.headers.referer);
    // res.end(pageHandlers.errorPage({
    //     status: err.status
    // }));
});

module.exports = app;