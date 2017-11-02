// TODO: A lot of updations regarding posts. Write the update chains in event handlers. 
'use strict'

const Constants = require('./Constants.js').Constants;
const _EVENTS = require('./Constants.js')._EVENTS;
const events = require('events');
var _EMITTER = new events.EventEmitter();
var mongoose = require('mongoose');

mongoose.connect('mongodb://' + Constants._DB_USER + ':' + Constants._DB_PASSWORD + '@ds145299.mlab.com:45299/mongody', {
    useMongoClient: true
});

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
    thread: [] // Struct: [ThreadID]
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
});
var Thread = mongoose.model('Thread', ThreadSchema);

// Reply Schema or Post Schema
const ReplySchema = mongoose.Schema({
    id: Number,
    replyToID: Number,
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
    }

    // Add users function.
    addUser(userDetails) {
        var user = new User({
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
                this._Emitter.emit(_EVENTS.USER_ADD_SUCCESS);
            }
        });
    }

    // Add Thread 
    addThread(threadDetails) {
        console.log('HIIIASJFLASF');
        var thread = new Thread({
            id: threadDetails.id,
            title: threadDetails.title,
            desc: threadDetails.desc,
            category: threadDetails.category,
            userName: threadDetails.userName
        });

        thread.save((err) => {
            if (err) {
                this._Emitter.emit(_EVENTS.THREAD_ADD_ERR);
            } else {
                this._Emitter.emit(_EVENTS.THREAD_ADD_SUCCESS, threadDetails.userName);
            }
        });
    }

    // Add Reply
    addReply(replyDetails) {
        var reply = new Reply({
            id: replyDetails.id,
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
                this._Emitter.emit(_EVENTS.USER_ADD_SUCCESS);
            }
        });
    }
}

module.exports = DB;

var db = new DB(_EMITTER);

_EMITTER.on(_EVENTS.THREAD_ADD_SUCCESS, (thread) => {
    console.log('Added thread: ' + thread);
});

db.addThread({
    id: 256,
    title: 'TITULAR',
    desc: 'Described',
    category: 'Cats',
    userName: 'Usery'
});