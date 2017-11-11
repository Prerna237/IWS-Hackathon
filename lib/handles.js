'use strict'

var handle = require('handlebars');
var fs = require('fs');
var path = require('path');

const _PUBLIC = path.join(__dirname, '..', 'public');
console.log(_PUBLIC);
// Landing Page
var landingPage = handle.compile(fs.readFileSync(path.join(_PUBLIC, 'landing_page.html')).toString());
// User Profile Page
var userProfile = handle.compile(fs.readFileSync(path.join(_PUBLIC , 'profile_page.html')).toString());
// Thread Page
var threadPage = handle.compile(fs.readFileSync(path.join(_PUBLIC , "thread_page.html")).toString());
// Category wise
var categoryPage = handle.compile(fs.readFileSync(path.join(_PUBLIC, "post_categorywise.html")).toString());
// Sign up
var signUpPage = handle.compile(fs.readFileSync(path.join(_PUBLIC, "signup_form.html")).toString());

module.exports.landingPage = landingPage;
module.exports.userProfile = userProfile;
module.exports.threadPage = threadPage;
module.exports.categoryPage = categoryPage;
module.exports.signUpPage = signUpPage;
