'use strict'

var handle = require('handlebars');
var fs = require('fs');
var path = require('path');

const _PUBLIC = path.join(__dirname, '..', 'public');
console.log(_PUBLIC);
// User Profile Page
var userProfile = handle.compile(fs.readFileSync(path.join(_PUBLIC , 'userpage.html')).toString());
// Post Page
var postPage = handle.compile(fs.readFileSync(path.join(_PUBLIC , "post.html")).toString());

module.exports.userProfile = userProfile;
module.exports.postPage = postPage;
