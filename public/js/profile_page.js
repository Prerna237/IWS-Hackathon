$(document).ready(function () {
    if (Cookies.get("loginStatus") == "FAIL") {
        alert("Login Failed");
        Cookies.remove("loginStatus")

    }
    $(".demo").letterpic();
    console.log("I'm ready");
    var userName = getCookie('pseudoUser');
    var pic = '<canvas class="demo" title="' + userName + '"alt="Pranjal" style="width:120px; height:120px; margin:5px 10px; border-radius:50%;"></canvas>'
    $('#profile_pic').append(pic);
    $(".demo").letterpic();

    console.log("Got pseudoUser to " + userName);
    console.log("Got username: " + userName);
    if (document.cookie) {
        // get threads by user
        $.ajax({
            url: '/threadsByUser/' + userName,
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: true,
            success: function (threads) {
                console.log("Threads received");
                document.userThreads = threads;
                showThreads(threads);
            }
        });

        // get replies by user
        $.ajax({
            url: '/replies/user/' + userName,
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: true,
            success: (replies) => {
                console.log("Got replies");
                document.userReplies = replies;
            }
        });

        // get threads bookmarked
        $.ajax({
            url: '/bookmarks/' + userName,
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: true,
            success: (replies) => {
                console.log("Got replies");
                document.userBookmarked = replies;
            }
        });
    }

    $('#QuestionsAsked').click(showThreads);
    $('#RepliesGiven').click(showReplies);
    $('#BookmarksGiven').click(showBookmarks);
    // $('#StarredThreads').click(showStarred);
});

// Populating user created Threads
function createThreadView(thread) {
    return `<div class="tab-content col-9" id="v-pills-tabContent">
    <div class="tab-pane fade show active" id="quesasked" role="tabpanel" aria-labelledby="QuestionsAsked">
    <div class="row">
    <div class="col-2">
    <span class="badge badge-secondary">${thread.category}</span>
    </div>
    <div class="col-10">
    <p class="post-title">${thread.title}</p>
    <div class="right">
    </div>
    </div>
    <div class="col" style="padding: 10px"></div>
    </div>
    </div>
    <div class="tab-pane fade" id="repliesgiven" role="tabpanel" aria-labelledby="RepliesGiven"></div>
    <div class="tab-pane fade" id="bookmarksgiven" role="tabpanel" aria-labelledby="BookmarksGiven"></div>
    <div class="tab-pane fade" id="starredthreads" role="tabpanel" aria-labelledby="StarredThreads"></div>
    </div>`
}

function createReplyView(reply) {
    return `<div class="tab-content col-9" id="v-pills-tabContent">
    <div class="tab-pane fade show active" id="quesasked" role="tabpanel" aria-labelledby="QuestionsAsked"></div>
  <div class="tab-pane fade show active" id="repliesgiven" role="tabpanel" aria-labelledby="RepliesGiven">
  <div class="row">
  <div class="col-2">
  <span class="badge badge-secondary">${thread.category}</span>
  </div>
  <div class="col-10">
  <p class="post-title">${reply.text}</p>
  <div class="right">
  </div>
  </div>
  <div class="col" style="padding: 10px"></div>
  </div>
  </div>
  <div class="tab-pane fade" id="bookmarksgiven" role="tabpanel" aria-labelledby="BookmarksGiven"></div>
  <div class="tab-pane fade" id="starredthreads" role="tabpanel" aria-labelledby="StarredThreads"></div>
  </div>`
}

function createBookmarksView(reply) {
    return `<div class="tab-content col-9" id="v-pills-tabContent">
    <div class="tab-pane fade show active" id="quesasked" role="tabpanel" aria-labelledby="QuestionsAsked"></div>
  <div class="tab-pane fade show active" id="repliesgiven" role="tabpanel" aria-labelledby="RepliesGiven"></div>
  <div class="tab-pane fade" id="bookmarksgiven" role="tabpanel" aria-labelledby="BookmarksGiven">
  <div class="row">
  <div class="col-2">
  <span class="badge badge-secondary">${thread.category}</span>
  </div>
  <div class="col-10">
  <p class="post-title">${thread.title}</p>
  <div class="right">
  </div>
  </div>
  <div class="col" style="padding: 10px"></div>
  </div>
  </div>
  <div class="tab-pane fade" id="starredthreads" role="tabpanel" aria-labelledby="StarredThreads"></div>
  </div>`
}

// function createStarredThreadView(thread) {
//     return `<div class="tab-content col-9" id="v-pills-tabContent">
//     <div class="tab-pane fade show active" id="quesasked" role="tabpanel" aria-labelledby="QuestionsAsked"></div>
//     <div class="tab-pane fade" id="repliesgiven" role="tabpanel" aria-labelledby="RepliesGiven"></div>
//     <div class="tab-pane fade" id="bookmarksgiven" role="tabpanel" aria-labelledby="BookmarksGiven"></div>
//     <div class="tab-pane fade show active" id="starredthreads" role="tabpanel" aria-labelledby="StarredThreads">
//   <div class="row">
//   <div class="col-2">
//   <span class="badge badge-secondary">${thread.category}</span>
//   </div>
//   <div class="col-10">
//   <p class="post-title">${thread.title}</p>
//   <div class="right">
//   </div>
//   </div>
//   <div class="col" style="padding: 10px"></div>
//   </div>
//   </div>
//   </div>`
// }

var showThreads = function (threads) {
    var quesasked = document.getElementById('quesasked');
    quesasked.innerHTML = "";
    if (document.userThreads || threads) {
        var uThreads = (Array.isArray(threads)) ? threads : document.userThreads;
        var ques = uThreads.map((thread, threadView) => {
            return createThreadView(thread);
        });
        if (ques.length > 0) {

            ques = ques.reduce((q, t) => {
                return q + t
            });
            quesasked.innerHTML = ques;
        } else {
            var nill = createThreadView({
                title: "No content here"
            });
            quesasked.innerHTML = nill;
            console.log(nill);

        }
    }
}

var showReplies = function () {
    var repliesgiven = document.getElementById('repliesgiven');
    repliesgiven.innerHTML = "";
    if (document.userReplies) {
        var ques = document.userReplies.map((thread, threadView) => {
            return createReplyView(thread);
        });
        console.log(ques);
        if (ques.length > 0) {
            ques = ques.reduce((q, t) => {
                return q + t
            });
            repliesgiven.innerHTML = ques;
        } else {
            alert("WHY");
            repliesgiven.innerHTML = createReplyView({
                text: "No contento here"
            });
        }
    }
}

// var showStarred = function () {
//     var starred = document.getElementById('starredthreads');
//     starred.innerHTML = "";
//     if (document.userStarred) {
//         var ques = document.userBookmarked.map((thread, threadView) => {
//             return createStarredThreadView(thread);
//         });
//         if (ques.length > 0) {
//             ques = ques.reduce((q, t) => {
//                 return q + t
//             });
//             starred.innerHTML = ques;
//         } else {
//             starred.innerHTML = createStarredThreadView({
//                 title: "No content here"
//             });
//         }
//     } else {
//         starred.innerHTML = createStarredThreadView({
//             title: "No content here"
//         });
//     }
// }

var showBookmarks = function () {
    var bookmarksgiven = document.getElementById('bookmarksgiven');
    bookmarksgiven.innerHTML = "";
    if (document.userBookmarked) {
        var ques = document.userBookmarked.map((thread, threadView) => {
            return createBookmarksView(thread);
        });
        console.log(ques);
        if (ques.length > 0) {
            ques = ques.reduce((q, t) => {
                return q + t
            });
            bookmarksgiven.innerHTML = ques;
        } else {
            alert("WHY");
            bookmarksgiven.innerHTML = createBookmarksView({
                text: "No contento here"
            });
        }
    }
}

