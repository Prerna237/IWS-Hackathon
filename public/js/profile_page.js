function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

$(document).ready(function () {
    console.log("I'm ready");
    var userName = getCookie('pseudoUser');
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
            url: '/threadsByStars/' + userName,
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
    </div>
    <div class="col-11">
    <p class="post-title">${thread.title}</p>
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

function createReplyView(reply) {
    return `<div class="tab-content col-9" id="v-pills-tabContent">
  <div class="tab-pane fade show active" id="quesasked" role="tabpanel" aria-labelledby="QuestionsAsked">
  <div class="row">
  <div class="col-1">
  </div>
  <div class="col-11">
  <p class="post-title">${reply.text}</p>
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

function createStarredThreadView(thread) {
    return `<div class="tab-content col-9" id="v-pills-tabContent">
  <div class="tab-pane fade show active" id="quesasked" role="tabpanel" aria-labelledby="QuestionsAsked">
  <div class="row">
  <div class="col-1">
  </div>
  <div class="col-11">
  <p class="post-title">${thread.title}</p>
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
        console.log(ques);
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