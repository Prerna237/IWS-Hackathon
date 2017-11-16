var thread_id = document.threadID;
var reply_id = '';

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

function checkCookie() {

    if (getCookie("userName") == "") {
        alert('login');
        document.getElementById('action').src = "res/login.png";
    }
    else {
        var element = document.getElementById("lol");
        alert('logout');
        element.parentNode.removeChild(element);
        document.getElementById("logout").style.display = "inline-block";
        document.getElementById("mypost").style.display = "inline-block";

    }
}

function UpdateThreads() {
    $.ajax({
        url: '/replies/thread/' + thread_id,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: true,
        success: function (threads) {
            console.log("Replies received");
            // console.log(threads);
            document.threadReplies = threads;
            document.len = document.threadReplies.length;
            alert(document.len);
            // console.log("WWWWWWWW " + document.getElementById('threadreplies').innerHTML);
            // (document.getElementById('threadreplies')).innerHTML = '';
            $('#threadreplies').empty();
            console.log("WWWWWWWW " + document.getElementById('threadreplies').innerHTML);
            
            var i = 0;
            var str = '';
            var uname;
            var rtext;
            for (i = 1; i <= document.len; i++) {
                // console.log(i);
                uname = document.threadReplies[i - 1].author;
                // console.log(uname);
                rtext = document.threadReplies[i - 1].text;
                // console.log(rtext);
                str = '<div id="iter' + i + '" class="col-12" style="padding-left: 0" role="tablist"></div><br>';
                // console.log(str);
                var content_fill = `<div id="r1" class="card">
                <div id="reply${i}" class="card-body">
                    <b>${uname}</b>
                    <br>
                    <br>
                    <p>${rtext}</p>
                    <div class="starrate" style="float: left; margin-bottom: -20px;"></div>
                    <div style="float: right; margin-bottom: -10px; margin-right: -10px;">

                        &nbsp;
                        <a id="reply_${i}${i}"onclick="openNav(this.id)" class="badge badge-primary" style="color: white; cursor: pointer;">&nbsp;Reply&nbsp;</a>
                        <a href="#" class="badge badge-danger">&nbsp;<span class="oi oi-flag"></span>&nbsp;</a>
                    </div>
                </div>

                <div id="reply${i}" class="card-footer accordian-toggle" role="tab" data-toggle="collapse" data-parent="#iter1" href="#reply1collapse">
                    <h6 style="color: dimgrey">View Replies</h6>
                </div>
            </div>`;
                $("#threadreplies").append(str);
                // console.log(content_fill);
                $("#iter" + i).append(content_fill);
            }
        }
    });
}

$(document).ready(function () {
    console.log('I am ready');
    if (document.cookie) {
        UpdateThreads();
    }


});

function CheckLogin() {
    if (getCookie("userName") == "") {
        alert("Please Login");
        return 0;
    } else {
        return 1;
    }

}

function openNav(id) {
    if (CheckLogin() == 1) {
        reply_id = id.toString();
        document.getElementById("mySidenav").style.display = "block";
        document.getElementById("mySidenav").style.height = "33.5%";
    }
}

function closeNav() {
    document.getElementById("mySidenav").style.height = "0%";
    document.getElementById("mySidenav").style.display = "none";
}

function AddReply() {
    var replytext = document.getElementById('reply').value;

    var jObj = new Object();
    console.log(thread_id);
    jObj.threadID = thread_id;
    jObj.replyToID = 0;
    jObj.userName = getCookie("userName");
    jObj.text = replytext;
    $.ajax({
        url: '/util/addReply',
        type: 'POST',
        data: JSON.stringify(jObj),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: false,
        success: function (msg) {
            console.log("MSG: " + JSON.stringify(msg));

        }
    });

    UpdateThreads();
    closeNav();
}