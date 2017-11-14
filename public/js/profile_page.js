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
    var userName = getCookie('userName');
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

                var quesasked = document.getElementById('quesasked');
                var ques = document.userThreads.map((thread) => {
                    return createThreadView(thread);
                });
                var st = "";
                for (var i = 0; i < ques.length; i++) {
                    st += ques[i];
                }
                console.log(st);
                quesasked.innerHTML = st;
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

    // Populating user created Threads
    function createThreadView(thread) {
        // var view = document.createElement('div');
        // view.setAttribute('class', 'tab-content col-9');
        // var innerView = document.createElement('div');
        // innerView.setAttribute('class', 'tab-pane fade show active');
        // innerView.setAttribute('role', 'tabpanel');
        // innerView.setAttribute('aria-labelledby', 'QuestionsAsked');
        // var rowDiv = document.createElement('div');
        // rowDiv.setAttribute('class', 'row');

        var elem = `<div class="tab-content col-9" id="v-pills-tabContent">
        <div class="tab-pane fade show active" id="quesasked" role="tabpanel" aria-labelledby="QuestionsAsked">
            <div class="row">
                <div class="col-1">
                    <img src="profilephoto.jpg" class="rounded-circle" alt="Cinque Terre" width="40px" height="40px">
                </div>
                <div class="col-11">
                    <p class="post-title">${thread.desc}</p>
                    <div class="right">
                    </div>
                </div>
                <div class="col" style="padding: 10px"></div>
            </div>
        </div>
        <div class="tab-pane fade" id="repliesgiven" role="tabpanel" aria-labelledby="v-pills-profile-tab">...</div>
        <div class="tab-pane fade" id="starredthreads" role="tabpanel" aria-labelledby="v-pills-messages-tab">...</div>
        </div>`
        return elem;
    }

    //populating user threads
    $('#starredthreads').each(function () {

    });
});