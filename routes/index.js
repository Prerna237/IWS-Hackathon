var express = require('express');
var router = express.Router();
var _Emitter = require('../lib/EventEmitter');
var _EVENTS = require('../lib/Constants')._EVENTS;
var pageHandlers = require('../lib/handles');

var db = require('../lib/DB');

/* GET home page. */
router.get('/', function (req, res) {
    // res.render('index', { title: 'Express' });
    // res.end("<html><body>This is working</body></html>");
    res.end(pageHandlers.landingPage());
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
    console.log(JSON.stringify(req.body));
    _Emitter.emit(_EVENTS.ADD_THREAD, req.body);
    res.end(JSON.stringify({
        status: 'success'
    }));
})

// Reply Handler
router.post('/util/addReply', (req, res) => {
    console.log(JSON.stringify(req.body));
    _Emitter.emit(_EVENTS.ADD_REPLY, req.body);
    res.end(JSON.stringify({
        status: 'success'
    }));
});

// Others

// Profile page
router.get('/profile', (req, res) => {
    console.log("Username: " + req.session.userName);
    if (req.session.userName != undefined) {
        res.end(pageHandlers.userProfile({
            userName: req.session.userName
        }));
    } else {
        res.redirect('/');
    }
});

// Data Fetching (AJAX)

router.get('/replies/:type/:id', (req, res) => {
    console.log("Type: " + req.params.type);
    var type = req.params.type;
    var id = req.params.id;
    db.getReplies(type, id, (results) => {
        res.end(JSON.stringify(results));
    });
});

router.get('/threads/:category', (req, res) => {
    var category = req.params.category;
    console.log("Request for threads from category " + category);
    db.getThreads(category.toString(), (results) => {
        res.end(JSON.stringify(results));
    });
});

module.exports = router;