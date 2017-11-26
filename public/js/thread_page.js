var thread_id = document.threadID;
var reply_id = '';
var mainreplies = [];
var is_bookmarked = 999;

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
        // console.log(isBookmarked());
        // if(isBookmarked() == -1){
        //     $('#book_mark').attr('class', '');
        //     $('#book_mark').attr('class', 'badge badge-warning');
        // }
    }
}

function UpdateThreads() {
    $.ajax({
        url: '/replies/thread/' + thread_id,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: false,
        success: function (threads) {
            console.log("Replies received");
            // console.log(threads);
            document.threadReplies = threads;
            document.len = document.threadReplies.length;
            $('#threadreplies').empty();

            var i = 0;
            var str = '';
            var uname;
            var rtext;
            for (i = 1; i <= document.len; i++) {
                rid = document.threadReplies[i - 1].id;
                mainreplies.push(rid);
                uname = document.threadReplies[i - 1].author;
                rtext = document.threadReplies[i - 1].text;
                str = `<div id="${rid}" class="col-12" style="padding-left: 0" role="tablist"></div><br>`;

                var content_fill = `<div class="card">
                                            <div class="card-body">
                                                <b>${uname}</b>
                                                <br>
                                                <br>
                                                <p>${rtext}</p>
                                                <div class="starrate" style="float: left; margin-bottom: -20px;"></div>
                                                <div style="float: right; margin-bottom: -10px; margin-right: -10px;">
                                                    &nbsp;
                                                    <a id="reply_${rid}" onclick="openNav(this.id)" class="badge badge-primary" style="color: white; cursor: pointer;">&nbsp;Reply&nbsp;</a>
                                                    <a id="report_${rid}" style="color: white; cursor: pointer;" onclick="reportPost(this.id)" class="badge badge-danger">&nbsp;<span class="oi oi-flag"></span>&nbsp;</a>
                                                </div>
                                            </div>

                                            <div id="footer_${rid}" style="cursor: pointer" onclick="javascript:addReplies(${rid})" class="card-footer accordian-toggle" role="tab" data-toggle="collapse" data-parent="#${rid}" href="#footer_${rid}collapse">
                                                <h6 style="color: dimgrey">View Replies</h6>
                                            </div>

                                            <div id="footer_${rid}collapse" class="collapse" role="tabpanel" aria-labelledby="footer_${rid}" data-parent="#${rid}">
                                            <h6 style="margin: 5px; color: dimgrey; text-align: center">No Replies</h6>
                                            </div>
                                        </div>
                                        <br>`;
                $("#threadreplies").append(str);
                $(`#${rid}`).append(content_fill);
            }
        }
    });
}

function predicateBy(prop) {
    return function (a, b) {
        if (a[prop] > b[prop]) {
            return -1;
        } else if (a[prop] < b[prop]) {
            return 1;
        }
        return 0;
    }
}

function UpdateSideBox(category) {
    $.ajax({
        url: '/threadsByCategory/' + category,

        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: true,
        success: function (data) {
            //some code;
            document.categories = data;
            document.categories.sort(predicateBy("views"));
            document.getElementById('sidebox').innerHTML = '';
            var data = '<div class="card-header text-center" style="background: blue; color: white;">More from this category</div><br>';
            for (var o = 0; o < 5; o++) {
                data += '<div class="row"><div class="col-2"><a class="user" id="' + document.categories[o].userName + '" style="cursor:pointer;"><canvas class="demo" title="' + document.categories[o].userName + '"alt="Pranjal" style="width:34px; height:34px; margin:-12px 10px; border-radius:50%;"></canvas></a></div><div class="col-10 " style="padding-left: 0px">&nbsp;&nbsp;&nbsp;<a href="/thread/'+document.categories[o].id+'?cat='+category+'">' + document.categories[o].title + '</a></div></div><hr>';
            }
            $('#sidebox').append('');
            $('#sidebox').append(data);
             $(".demo").letterpic();
        }
    });
}

$(document).ready(function () {
   $(".demo").letterpic();
    console.log('I am ready');
    if (Cookies.get("loginStatus") == "FAIL" || Cookies.get("loginStatus") == "NO_USER") {
        swal(
            'Oops!',
            'Wrong Credentials, Try Again',
            'error'
        )
        Cookies.remove("loginStatus")

    }
    if (document.cookie) {
        function getParameterByName(name, url) {
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        }

        document.cat = getParameterByName("cat");
        console.log(document.cat);

        if (document.cat == null) {
            ////alert("I am here");
            document.cat = "Category1";
        }

        UpdateThreads();
        // $(".demo").letterpic();
        if (getCookie('userName') != "") {
            is_bookmarked = isBookmarked();
        }

        if (is_bookmarked != -1) {
            $('#book_mark').attr('class', '');
            $('#book_mark').attr('class', 'badge badge-warning');
        }

        UpdateSideBox(document.cat);
        // $(".demo").letterpic();
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
    if (reply_id == '0') {
        jObj.replyToID = 0;
    }
    else {
        jObj.replyToID = parseInt(reply_id.substr(6));
    }
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
    document.getElementById('reply').value="";
    closeNav();
}

function reportPost(id) {
    if (CheckLogin() == 1) {
        var report_id = parseInt(id.toString().substr(7));
        if (report_id == 0) {
            report_id = thread_id;
        }
        $.ajax({
            url: '/util/threadReport/' + report_id,
            async: true,
            success: function (msg) {
                console.log("MSG: " + JSON.stringify(msg));
                console.log("Post Reported.");
                $('#reportmodal').modal('show');
            }
        });
    }
}

function bookmarkPost() {
    if (CheckLogin() == 1) {
        if (is_bookmarked == -1) {
            $.ajax({
                url: '/util/bookmark/' + thread_id,
                type: 'POST',
                async: false,
                success: function (msg) {
                    console.log("MSG: " + JSON.stringify(msg));
                    console.log("Post Bookmarked.");
                    $('#bookmarkmodal').modal('show');
                    $('#book_mark').attr('class', '');
                    $('#book_mark').attr('class', 'badge badge-warning');
                }
            });
        }
    }
}

function addReplies(id) {
    $.ajax({
        url: '/replies/reply/' + id,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: false,
        success: function (threads) {
            console.log("Replies received");
            document.replyReplies = threads;
            document.rlen = document.replyReplies.length;
            // $(`#footer_${id}collapse`).empty();
            if (document.rlen != 0) {
                $(`#footer_${id}collapse`).empty();
            }

            var i = 0;
            var str = '';
            var uname;
            var rtext;
            for (i = 1; i <= document.rlen; i++) {
                rid = document.replyReplies[i - 1].id;
                uname = document.replyReplies[i - 1].author;
                rtext = document.replyReplies[i - 1].text;
                str = `<br><div id="${rid}" class="col-12" role="tablist"></div>`;

                var content_fill = `<div class="card">
                                            <div class="card-body">
                                                <b>${uname}</b>
                                                <br>
                                                <br>
                                                <p>${rtext}</p>
                                                <div class="starrate" style="float: left; margin-bottom: -20px;"></div>
                                                <div style="float: right; margin-bottom: -10px; margin-right: -10px;">
                                                    &nbsp;
                                                    <a id="reply_${rid}" onclick="openNav(this.id)" class="badge badge-primary" style="color: white; cursor: pointer;">&nbsp;Reply&nbsp;</a>
                                                    <a id="report_${rid}" style="color: white; cursor: pointer;" onclick="reportPost(this.id)" class="badge badge-danger">&nbsp;<span class="oi oi-flag"></span>&nbsp;</a>
                                                </div>
                                            </div>

                                            <div id="footer_${rid}" onclick="javascript:addReplies(${rid})" class="card-footer accordian-toggle" role="tab" data-toggle="collapse" data-parent="#${rid}" href="#footer_${rid}collapse" style="cursor: pointer">
                                                <h6 style="color: dimgrey">View Replies</h6>
                                            </div>

                                            <div id="footer_${rid}collapse" class="collapse" role="tabpanel" aria-labelledby="footer_${rid}" data-parent="#${rid}">
                                            <h6 style="margin: 5px; color: dimgrey; text-align: center">No Replies</h6>
                                            </div>
                                        </div>
                                        <br>`;
                $(`#footer_${id}collapse`).append(str);
                // console.log(content_fill);
                $(`#${rid}`).append(content_fill);
            }
        }
    });

}

function isBookmarked() {
    $.ajax({
        url: '/bookmarks/' + getCookie('userName'),
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: false,
        success: function (threads) {
            document.bookmarkArr = threads.map(thread => thread.id);
        }
    });

    return (document.bookmarkArr.findIndex(e => e == document.threadID));
}
