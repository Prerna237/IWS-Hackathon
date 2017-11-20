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

        // get threads starred
        $.ajax({
            url: '/bookmarks/' + userName,
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: true,
            success: (replies) => {
                console.log("Got replies");
                document.userStarred = replies;
            }
        });
    }
    //populating user threads
    $('#starredthreads').each(function () {

    });

    $('#QuestionsAsked').click(showThreads);
    $('#v-pills-profile-tab').click(showReplies);
    $('#v-pills-settings-tab').click(showStarred);
});

// Populating user created Threads
function createThreadView(thread) {
    return `<div class="tab-content col-9" id="v-pills-tabContent">
    <div class="tab-pane fade show active" id="quesasked" role="tabpanel" aria-labelledby="QuestionsAsked">
    <div class="row">
    <div class="col-1">
    <span class="badge badge-secondary">${thread.category}</span>
    </div>
    <div class="col-11">
    <p class="post-title">&nbsp;&nbsp;<a href="/thread/${thread.id}" style="color:black; text-decoration:none;">${thread.title}</a></p>
    <div class="right">
    </div>
    </div>
    <div class="col" style="padding: 10px"></div>
    </div>
    </div>
    <div class="tab-pane fade" id="repliesgiven" role="tabpanel" aria-labelledby="v-pills-profile-tab">...</div>
    <div class="tab-pane fade" id="starredthreads" role="tabpanel" aria-labelledby="v-pills-messages-tab">...</div>
    </div>`
}

// function getThreadByReplyID(reply_id) {
//     // console.log('Reply ID: ', reply_id);
//     $.ajax({
//         url: '/thread/' + reply_id.threadID,
//         type: 'GET',
//         contentType: 'application/json; charset=utf-8',
//         dataType: 'json',
//         async: false,
//         success: function (data) {
//             document.replyThread = data;
//             console.log(document.replyThread);      
//         }
//     });
    
// }

function createReplyView(reply) {
    return `<div class="tab-content col-9" id="v-pills-tabContent">
  <div class="tab-pane fade show active" id="quesasked" role="tabpanel" aria-labelledby="QuestionsAsked">
  <div class="row">
  <div class="col-1"><span class="badge badge-primary">Thread</span></div>
  <div class="col-11"></div>
  <div class="col" style="padding: 10px"></div>
  </div>
  <div class="row">
  <div class="col-1"><span class="badge badge-success">Reply</span></div>
  <div class="col-11">${reply.text}</div>
  <div class="col" style="padding: 10px"></div>
  </div>
  <div class="row">
  <div class="col" style="padding: 10px"></div>
  </div>
  </div>
  <div class="tab-pane fade" id="repliesgiven" role="tabpanel" aria-labelledby="v-pills-profile-tab">...</div>
  <div class="tab-pane fade" id="starredthreads" role="tabpanel" aria-labelledby="v-pills-messages-tab">...</div>
  </div>`
}

function createStarredThreadView(thread) {
    return `<div class="tab-content col-9" id="v-pills-tabContent">
  <div class="tab-pane fade show active" id="quesasked" role="tabpanel" aria-labelledby="QuestionsAsked">
  <div class="row">
  <div class="col-1">
  ${ (thread.title != "No content here") ?
            `<span class="badge badge-secondary">${thread.category}</span>` : ''
        }
  </div>
  <div class="col-11">
  <p class="post-title">&nbsp;&nbsp;${(thread.title != "No content here")? `<a href="/thread/${thread.id}" style="color:black; text-decoration:none;">` : ''}${thread.title}</a></p>
  <div class="right">
  </div>
  </div>
  <div class="col" style="padding: 10px"></div>
  </div>
  </div>
  <div class="tab-pane fade" id="repliesgiven" role="tabpanel" aria-labelledby="v-pills-profile-tab">...</div>
  <div class="tab-pane fade" id="starredthreads" role="tabpanel" aria-labelledby="v-pills-messages-tab">...</div>
  </div>`
}

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
    var quesasked = document.getElementById('quesasked');
    quesasked.innerHTML = "";
    if (document.userReplies) {
        var ques = document.userReplies.map((thread, threadView) => {
            return createReplyView(thread);
        });
        // console.log(ques);
        if (ques.length > 0) {
            ques = ques.reduce((q, t) => {
                return q + t
            });
            quesasked.innerHTML = ques;
        } else {
            alert("WHY");
            quesasked.innerHTML = createReplyView({
                text: "No contento here"
            });
        }
    }
}

var showStarred = function () {
    var quesasked = document.getElementById('quesasked');
    quesasked.innerHTML = "";
    if (document.userStarred) {
        var ques = document.userStarred.map((thread, threadView) => {
            return createStarredThreadView(thread);
        });
        if (ques.length > 0) {
            ques = ques.reduce((q, t) => {
                return q + t
            });
            quesasked.innerHTML = ques;
        } else {
            quesasked.innerHTML = createStarredThreadView({
                title: "No content here"
            });
        }
    } else {
        quesasked.innerHTML = createStarredThreadView({
            title: "No content here"
        });
    }
}

function getThreadsByID(id) {
    
}