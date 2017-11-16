$(document).ready(function () {
  $(".demo").letterpic();

  $('#dd .dropdown-item').click(function () {
    document.retval = $(this).text();
  });
  $("#addThreadButton").click(function () {
    alert(document.retval);
    var jobject = new Object();
    jobject.title = $("#title").val();
    jobject.desc = $("#desc").val();
    jobject.category = document.retval;
    jobject.userName = Cookies.get("userName");
    $.ajax({
      url: '/util/addThread',
      type: 'POST',
      data: JSON.stringify(jobject),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      async: false,
      success: function (msg) {
        console.log("MSG: " + JSON.stringify(msg));

      }
    });
  });
  $('a.threadclick').click(function () {
    var id = $(this).attr('id');
    alert(id);
    window.location = '/thread/' + id;
  });

  $('#ddd .dropdown-item').click(function () {
    cat = $(this).text();
    $("#category").html(cat);
    document.cat = cat;
    $.ajax({
      url: '/threadsByCategory/' + cat,

      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      async: true,
      success: function (data) {
        //some code;
        document.categories = data;
        $("#table").find("tr:gt(0)").remove();
        var data = "";
        $.each(document.categories, function (i, item) {
          data += '<tr><th scope="row">' + document.cat + '</th><td><a onclick="javascript:threadClick()" class="threadclick" id="' + item.id + '">Why are mobiles black? Are they good?</a></td><td><canvas class="demo" title="' + item.userName + '"alt="Pranjal" style="width:34px; height:34px; margin:-12px 10px; border-radius:50%;"></canvas></td><td>' + item.numReplies + '</td><td>' + item.views + '</td><td><span class="badge badge-primary"><span class="oi oi-star"></span>5</span></td></tr>';

        });
        $('#table').append(data);
        $('a.threadclick').click(function () {
          var id = $(this).attr('id');
          alert(id);
          window.location = '/thread/' + id;
        });
      },
      type: 'GET'
    });


  });


});