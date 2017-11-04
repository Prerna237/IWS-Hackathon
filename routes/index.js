var express = require('express');
var router = express.Router();
var _Emitter = require('../lib/EventEmitter');
var _EVENTS = require('../lib/Constants')._EVENTS;

/* GET home page. */
router.get('/', function (req, res, next) {
    // res.render('index', { title: 'Express' });
    next();
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

module.exports = router;