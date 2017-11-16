'use strict'
// TODO: Rating url

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
    // _Emitter.emit(_EVENTS.ADD_USER, req.body);
    db.addUser(req.body, (status) => {
        req.session.userName = req.body.userName;
        res.end(JSON.stringify(status));
    });
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

// Get Categories
router.get('/util/categories', (req, res) => {
    db.getCategories((categories) => {
        res.end(JSON.stringify(categories));
    });
})

// Report Thread
router.get('/util/threadReport/:threadID', (req, res) => {
    var userName = req.session.userName;
    db.reportThread(req.params.threadID, userName);
});

// Rate Things
router.post('/util/rate', (req, res) => {
    var type = req.body.type;
    var id = req.body.id;
    var rating = req.body.rating;
    var userName = req.body.userName;

    console.log("Got a rate request");
    db.rate(type, id, rating, userName);
    res.end(JSON.stringify({
        status: "success"
    }));
});

// Others

// Profile page
router.get('/profile', (req, res) => {
    console.log("Username: " + req.session.userName);
    if (req.session.userName != undefined) {
        db.getUser(req.session.userName, (user) => {
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
        })
    } else {
        res.redirect('/');
    }
});

// Thread Page

router.get('/thread/:id', (req, res) => {
    var threadID = req.params.id;
    db.getThread(threadID, (thread) => {
        res.end(pageHandlers.threadPage({
            threadID: thread.id,
            title: thread.title,
            desc: thread.desc,
            category: thread.category,
            numReplies: thread.numReplies,
            user: thread.userName,
            threadRating: thread.avgStars
        }));
    });
});

// Category-wise page

router.get('/categorywise', (req, res) => {
    if (req.session.moderator) {
        // console.log('Sending Moderator Page');
        res.end(pageHandlers.categoryModeratorPage());
    }
    res.end(pageHandlers.categoryPage());
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

router.get('/threadsByCategory/:category', (req, res) => {
    var category = req.params.category;
    console.log("Request for threads from category " + category);
    db.getThreadsByCategory(category.toString(), (results) => {
        res.end(JSON.stringify(results));
    });
});

router.get('/threadsByUser/:userName', (req, res) => {
    console.log("ThreadsByUser requested");
    var userName = req.params.userName;
    db.getThreadsByUser(userName, (threads) => {
        res.end(JSON.stringify(threads));
    });
});

router.get('/threadsByStars/:userName', (req, res) => {
    console.log('threadsByStars');
    var userName = req.params.userName;
    db.getReplies('star', userName, (results) => {
        res.end(JSON.stringify(results));
    })
})

module.exports = router;