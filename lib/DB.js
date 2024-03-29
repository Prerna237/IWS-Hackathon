// TODO: Maybe use '_id' generated by db as references to all objects

'use strict'

const Constants = require('./Constants.js').Constants;
const _EVENTS = require('./Constants.js')._EVENTS;
const events = require('events');
const fs = require('fs');
var mongoose = require('mongoose');
var async = require('async');

// DB Schemas

// User Schema
const UserSchema = mongoose.Schema({
    name: String,
    email: String,
    userName: String,
    password_hash: String,
    date_of_join: Date,
    profile_type: String,
    rating: Number,
    social: [],
    interests: [],
    stars: [], // Struct: [{PostID, Stars}, ...]
    bookmarks: [], // Struct: [ThreadID, ..]
    replies: [], // Struct: [PostID]
    threads: [] // Struct: [ThreadID]
});
var User = mongoose.model('User', UserSchema);

// Thread ID
const ThreadSchema = mongoose.Schema({
    id: Number,
    title: String,
    desc: String,
    category: String,
    repliesIndependent: [], // IDs of posts as replies to the main topic.,
    averageStars: Number,
    userName: String, // User who started the thread
    numReplies: Number
});
var Thread = mongoose.model('Thread', ThreadSchema);

// Reply Schema or Post Schema
const ReplySchema = mongoose.Schema({
    id: Number,
    threadID: Number,
    replyToID: Number, // This is '0' if it is an independent post 
    replies: [], // Replies to this reply
    avgStars: Number,
    userName: String, // User who wrote this reply
    reportBy: [] // Struct: [UserID, UserID, ...]
});
var Reply = mongoose.model('Reply', ReplySchema);

// Category Schema
const CategorySchema = mongoose.Schema({
    id: Number,
    title: String,
    threadIDs: []
});
var Category = mongoose.model('Category', CategorySchema);

class DB {
    constructor(_Emitter) {
        this._Emitter = _Emitter;
        mongoose.connect('mongodb://' + Constants._DB_USER + ':' + Constants._DB_PASSWORD + '@ds145299.mlab.com:45299/mongody', {
            useMongoClient: true
        }).then(() => {
            console.log("Connected.")
        });
        // DBCount stores the universal count of all the entities: Posts, Threads, Users etc.
        this.DBCount = (function () {
            var dbCount;
            if (!(fs.existsSync('./DBCount.json'))) {
                console.log("Making DBCount");
                dbCount = {};
                dbCount.replies = 0;
                dbCount.threads = 0;
                dbCount.users = 0;
                console.log("dbCount: " + User.where({}).count());
            } else {
                console.log("I'm in else");
                dbCount = JSON.parse(fs.readFileSync('./DBCount.json'));
            }
            dbCount.incReplies = function () {
                this.replies += 1;
            };
            dbCount.incThreads = function () {
                this.threads += 1;
            }
            dbCount.incUsers = function () {
                this.users += 1;
                console.log(JSON.stringify(this));
            }

            dbCount.getReplyID = function () {
                this.incReplies();
                this.save();
                return this.replies;
            }
            dbCount.getThreadID = function () {
                this.incThreads();
                this.save();
                return this.threads;
            }
            dbCount.getUserID = function () {
                this.incUsers();
                this.save();
                return this.users;
            }

            dbCount.save = function () {
                // fs.writeFileSync('./DBCount.json', JSON.stringify(this));
                console.log("Done Saving.");
            }

            User.count().then(uCount => {
                dbCount.users = uCount;
                Reply.count().then(rCount => {
                    dbCount.replies = rCount;
                    Thread.count().then(tCount => {
                        dbCount.threads = tCount;
                        console.log("dbCount : " + JSON.stringify(dbCount));
                        this.DBCount.users = dbCount.users;
                        this.DBCount.threads = dbCount.threads;
                        this.DBCount.replies = dbCount.replies;
                        console.log(JSON.stringify(this.DBCount));
                    })
                });
            });

            // async.series([
            //     () => {
            //         User.count().then(uc => {
            //             dbCount.users = uc;
            //             console.log("User count found");
            //         });
            //     },
            //     () => {
            //         Reply.count().then(rc => {
            //             dbCount.replies = rc;
            //             console.log("Reply count found");
            //         });
            //     },
            //     () => {
            //         Thread.count().then(tc => {
            //             dbCount.threads = tc;
            //             console.log("Thread count found");                        
            //         });
            //     }
            // ], (e, r) => {
            //             console.log(JSON.stringify(this.DBCount));                
            // });
            console.log("Voila!");
            return dbCount;
        })();

        // this.DBCount.getUserID();
        console.log("DBCount: " + JSON.stringify(this.DBCount));

        // Binding methods to object
        this.addUser = this.addUser.bind(this);
        this.addReply = this.addReply.bind(this);
        this.addThread = this.addThread.bind(this);
        this.checkAuth = this.checkAuth.bind(this);

        // Add event handlers
        this._Emitter.addListener(_EVENTS.ADD_THREAD, this.addThread);
        this._Emitter.addListener(_EVENTS.ADD_USER, this.addUser);
        this._Emitter.addListener(_EVENTS.ADD_REPLY, this.addReply);
        this._Emitter.addListener(_EVENTS.CHECK_USER_AUTH, this.checkAuth);
    }

    // Setter functions
    // Add users function.
    addUser(userDetails) {
        let uid = this.DBCount.getUserID();
        var user = new User({
            id: uid,
            userName: userDetails.userName,
            name: userDetails.name,
            email: userDetails.email,
            password_hash: userDetails.password_hash,
            date_of_join: new Date(),
            profile_type: userDetails.profile_type,
            rating: 0,
            social: userDetails.social,
            interests: userDetails.interests
        });

        user.save((err) => {
            if (err) {
                this._Emitter.emit(_EVENTS.USER_ADD_ERR);
            } else {
                this._Emitter.emit(_EVENTS.USER_ADD_SUCCESS, user);
            }
        });
    }

    // Add Thread 
    addThread(threadDetails) {
        var thread = new Thread({
            id: this.DBCount.getThreadID(),
            title: threadDetails.title,
            desc: threadDetails.desc,
            category: threadDetails.category,
            userName: threadDetails.userName
        });

        thread.save((err) => {
            if (err) {
                this._Emitter.emit(_EVENTS.THREAD_ADD_ERR);
            } else {
                this._Emitter.emit(_EVENTS.THREAD_ADD_SUCCESS, thread);

                User.findOne({
                    userName: threadDetails.userName
                }, (err, user) => {
                    user.threads.push(thread.id);
                    user.save((err) => {
                        if (err) console.log("Error updating ThreadID in user array");
                        else console.log("Successfully updated ThreadID in user array");
                    });
                });
            }
        });
    }

    // Add Reply
    addReply(replyDetails) {
        var reply = new Reply({
            id: this.DBCount.getReplyID(),
            replyToID: replyDetails.replyToID,
            replies: [],
            avgStars: 0,
            userName: replyDetails.userName,
            reportBy: []
        });

        reply.save((err) => {
            if (err) {
                this._Emitter.emit(_EVENTS.REPLY_ADD_ERR);
            } else {
                this._Emitter.emit(_EVENTS.USER_ADD_SUCCESS, reply);

                // Independent posts i.e., replyToID = 0
                if (reply.replyToID == 0) {
                    Thread.findOne({
                        id: reply.threadID
                    }, (err, thread) => {
                        thread.repliesIndependent.push(reply.id); // Updating replies array of corresponding thread
                        thread.save((err) => {
                            if (err) console.log("Error updating ReplyTo array");
                            else console.log("Successfully updated ReplyTo array");
                        })
                    });
                } else { // Replies to posts or replies.
                    Reply.findOne({
                        id: reply.replyToID
                    }, (err, replyTo) => {
                        replyTo.replies.push(reply.id);
                        replyTo.save((err) => {
                            if (err) console.log("Error updating ReplyTo array");
                            else console.log("Successfully updated ReplyTo array");
                        })
                    });
                }

                // Saving to User reply array
                User.findOne({
                    userName: replyDetails.userName
                }, (err, user) => {
                    user.replies.push(reply.id);
                    user.save((err) => {
                        if (err) console.log("Error updating replies array");
                        else console.log("Successfully updated replies array");
                    })
                });
            }
        });
    }

    // Check user authentication
    checkAuth(userDetails) {
        User.findOne({
            userName: userDetails.userName
        }, (err, user) => {
            if (err) {
                console.log("Error: " + err);
                this._Emitter.emit(_EVENTS.NO_SUCH_USER);
            } else if (user) {
                if (user.password_hash === userDetails.password_hash) {
                    this._Emitter.emit(_EVENTS.USER_AUTH_SUCCESS);
                } else {
                    this._Emitter.emit(_EVENTS.USER_AUTH_FAIL);
                }
            } else {
                this._Emitter.emit(_EVENTS.NO_SUCH_USER);
            }
        });
    }
    // Event Handlers
}

module.exports = DB;