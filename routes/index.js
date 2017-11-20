'use strict'
// TODO: Rating url
// TODO: Security for Analytics page
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
    if (req.session.userName) {
        res.end(pageHandlers.landingPage({
           interests: req.session.interests
        }));
    } else {
        res.end(pageHandlers.landingPage());
    }

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
router.use('/util/threadReport/:threadID', (req, res) => {
    var userName = req.session.userName;
    console.log("Reporting by username: " + req.session.userName);
    db.reportThread(req.params.threadID, userName, () => {
        res.end(JSON.stringify({
            status: 'success'
        }));
    });
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

// Bookmark
router.post('/util/bookmark/:threadID', (req, res) => {
    let userName = req.session.userName;
    let threadID = req.params.threadID;
    if (userName == undefined) {
        res.end(JSON.stringify({
            status: "failure"
        }));
    } else {
        db.bookmark(userName, threadID);
        res.end(JSON.stringify({
            status: "success"
        }));
    }
});

// Report Things
router.use('/util/report/:type/:id', (req, res) => {
    if (req.session.userName) {
        res.end({
            status: "success"
        });
        db.report(req.params.type, req.params.id, req.session.userName);
    }
});

// Others

// Profile page
router.get('/profile', (req, res) => {
    console.log("Username: " + req.session.userName);
    if (req.session.userName) {
        res.cookie('pseudoUser', req.session.userName);
        db.getUser(req.session.userName, (user) => {
            console.log('Sending User ' + user.userName);
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
                accountType: user.profile_type,
                interests: user.interests
            }));
        })
    } else {
        console.log('Redirecting to landing page');
        res.redirect('/');
    }
});

// Profile page
router.get('/profile/:userName', (req, res) => {
    console.log("I'm getting called");
    var userName = req.params.userName;
    res.cookie('pseudoUser', userName);
    console.log("Setting pseudoUser to " + userName);
    if (userName) {
        db.getUser(userName, (user) => {
            if (user) {
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
                    accountType: user.profile_type,
                    interests: user.interests
                }));
            } else {
                res.end(pageHandlers.errorPage({
                    status: 404
                }));
            }
        });
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
            author: thread.userName,
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

router.get('/threadByID/:ids', (req, res) => {
    let ids = JSON.parse(req.params.ids);
    console.log("IDS : " + ids);
    db.getThreads(ids, (threads) => {
        res.end(JSON.stringify(threads));
    })
});

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

router.get('/bookmarks/:userName', (req, res) => {
    db.getBookmarks(req.params.userName, (bookmarks) => {
        res.end(JSON.stringify(bookmarks));
    });
});

router.get('/threadsByStars/:userName', (req, res) => {
    console.log('threadsByStars');
    var userName = req.params.userName;
    db.getReplies('star', userName, (results) => {
        res.end(JSON.stringify(results));
    })
})

// Trending
router.get('/trending', (req, res) => {
    db.getTrending(50, (results) => {
        res.end(JSON.stringify(results));
    });
});

// Analytics page

router.use('/analytics', (req, res, next) => {
    console.log("Request by: " + req.session.userName);
    console.log("Type: " + req.session.moderator);
    if (req.session.moderator) {
        db.getCategoryAnalytics((details) => {
            res.end(pageHandlers.analyticsPage(details));
        });
    } else {
        res.end(pageHandlers.errorPage({
            status: 404
        }));
    }
});

module.exports = router;
