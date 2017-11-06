var EventEmitter = require('events').EventEmitter;

const Constants = {};

Constants._DB_USER = 'usery';
Constants._DB_PASSWORD = 'user_password';

const _EVENTS = {
    USER_ADD_ERR: 'USER_ADD_ERR',
    USER_ADD_SUCCESS: 'USER_ADD_SUCCESS',
    THREAD_ADD_ERR: 'THREAD_ADD_ERR',
    THREAD_ADD_SUCCESS: 'THREAD_ADD_SUCCESS',
    REPLY_ADD_ERR: 'REPLY_ADD_ERR',
    REPLY_ADD_SUCCESS: 'REPLY_ADD_SUCCESS',
    ADD_USER: 'ADD_USER',
    ADD_THREAD: 'ADD_THREAD',
    ADD_REPLY: 'ADD_REPLY',
    NO_SUCH_USER: 'NO_SUCH_USER',
    USER_AUTH_SUCCESS: 'USER_AUTH_SUCCESS',
    USER_AUTH_FAIL: 'USER_AUTH_FAIL',
    CHECK_USER_AUTH: 'CHECK_USER_AUTH'
};

const _CATEGORIES = {

}

var _DB; // Needs to be set in app.js (Stupid idea. Need to implement another way.) 

module.exports.Constants = Constants;
module.exports._EVENTS = _EVENTS;
module.exports._CATEGORIES = _CATEGORIES;
module.exports._DB = _DB;