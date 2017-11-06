var express = require('express');
var router = express.Router();
var _Emitter = require('../lib/EventEmitter');
var _EVENTS = require('../lib/Constants')._EVENTS;
var pageHandlers = require('../lib/handles');

/* GET home page. */
router.get('/', function (req, res) {
    // res.render('index', { title: 'Express' });
    res.end("<html><body>This is working</body></html>");
    // res.end(pageHandlers.landingPage());
    // next();
});

// Util functions. Add [entities]
// User handler
router.post('/util/addUser', function (req, res, next) {
    // console.log(JSON.stringify(req.body));
    _Emitter.emit(_EVENTS.ADD_USER, req.body);
    res.end(JSON.stringify({
        status: 'success',
        userName: req.body.userName
    }));
});

// Thread handler
router.post('/util/addThread', (req, res) => {
    _Emitter.emit(_EVENTS.ADD_THREAD, req.body);
    res.end(JSON.stringify({
        status: 'success'
    }));
})

// Reply Handler
router.post('/util/addReply', (req, res) => {
    _Emitter.emit(_EVENTS.ADD_REPLY);
    res.end(JSON.stringify({
        status: 'success'
    }));
});

// Others

// Profile page
router.get('/profile', (req, res) => {
    res.end(pageHandlers.userProfile({userName: req.session.userName}));    
});

module.exports = router;