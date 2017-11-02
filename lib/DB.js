'use strict'

const Constants = require('./Constants.js');
var mongoose = require('mongoose');
const _Emitter = new require('events').EventEmitter(); // Need to use a universal EventEmitter


mongoose.connect('mongodb://' + Constants._DB_USER + ':' + Constants._DB_PASSWORD + '@ds145299.mlab.com:45299/mongody', {
    useMongoClient: true
});

var UserSchema = mongoose.Schema({
    name: String,
    email: String,
    password_hash: String,
    date_of_join: Date,
    profile_type: String,
    rating: Number,
    social: [],
    interests: []
});

const User = mongoose.model('User', UserSchema);

function addUser(userDetails){
    var user = new User(userDetails);
    user.save((err) => {
        if(err){
            _Emitter.emit('USER_ADD_ERR');
        }else{
            _Emitter.emit('USER_ADD_SUCCESS');
        }
    });
}