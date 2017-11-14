function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
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
    if(document.cookie) {
        // get threads by user
        $.ajax({
            url: '/threadsByUser/' + userName,
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: true,
            success: function(threads){
                console.log("Threads received");
                document.userThreads = threads;
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
    $('#starredthreads').each(function() {

    });
});
