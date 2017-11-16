var tid = 1;

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

$(document).ready(function() {
    console.log('I am ready');
    if (document.cookie) {
        $.ajax({
            url: '/replies/thread/' + tid,
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: true,
            success: function (threads) {
                console.log("Replies received");
                document.threadReplies = threads;
            }
        });
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

function openNav() {
    if (CheckLogin() == 1) {
        document.getElementById("mySidenav").style.display = "block";
        document.getElementById("mySidenav").style.height = "33.5%";   
    }
}