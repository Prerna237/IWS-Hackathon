'use strict'

var Apriori = require("apriori");
const db = require('./DB');
const fs = require('fs');
// Need to fetch from db.
function performAnalysis() {
    const _View_DATA = db.fetchData({
        type: "Views"
    });
    const _BOOKMARK_DATA = db.fetchData({
        type: "Bookmarks"
    });
    const _REPLY_DATA = db.fetchData({
        type: "Replies"
    });

    const _VIEW_FILE = './temp/views.csv';
    const _BOOKMARK_FILE = './temp/bookmarks.csv';
    const _REPLY_FILE = './temp/replies.csv';

    // Create Temp files

    fs.writeFileSync(_VIEW_FILE, _View_DATA);
    fs.writeFileSync(_BOOKMARK_DATA, _BOOKMARK_DATA);
    fs.writeFileSync(_REPLY_FILE, _REPLY_DATA);

    var viewResults = new Apriori.Algorithm(0.15, 0.6, false).showAnalysisResultFromFile(_VIEW_FILE);
    var bookmarkResults = new Apriori.Algorithm(0.15, 0.6, false).showAnalysisResultFromFile(_BOOKMARK_DATA);
    var replyResults = new Apriori.Algorithm(0.15, 0.6, false).showAnalysisResultFromFile(_REPLY_FILE);

    db.storePredictions({
        viewsPredictions: viewResults,
        bookmarkPredictions: bookmarkResults,
        replyrPredictions: replyResults
    });

    setTimeout(performAnalysis, 1000 * 60 * 60 * 4); // 4 hrs
}