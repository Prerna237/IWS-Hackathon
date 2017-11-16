$(document).ready(function () {
  function predicateBy(prop){
	return function(a,b){
      if( a[prop] > b[prop]){
          return -1;
      }else if( a[prop] < b[prop] ){
          return 1;
      }
      return 0;
   }
	}
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
          data += '<tr><th scope="row">' + document.cat + '</th><td><a class="threadclick" id="' + item.id + '">Why are mobiles black? Are they good?</a></td><td><a class="user" id="'+item.userName+'"><canvas class="demo" title="' + item.userName + '"alt="Pranjal" style="width:34px; height:34px; margin:-12px 10px; border-radius:50%;"></canvas></a></td><td>' + item.numReplies + '</td><td>' + item.views + '</td><td><span class="badge badge-primary"><span class="oi oi-star"></span>'+item.rating+'</span></td></tr>';

        });
        $('#table').append(data);
        $('a.threadclick').click(function () {
          var id = $(this).attr('id');
          alert(id);
          window.location = '/thread/' + id;
        });
        $('a.user').click(function () {
          var title = $(this).attr('id');
          window.location="users/profile/"+title;
        });
          $(".demo").letterpic();
      },
      type: 'GET'
    });
  });

  $('#top').click(function() {

    document.categories.sort(predicateBy("views"));
    $("#table").find("tr:gt(0)").remove();
    var data = "";
    $.each(document.categories, function (i, item) {
      data += '<tr><th scope="row">' + document.cat + '</th><td><a class="threadclick" id="' + item.id + '">Why are mobiles black? Are they good?</a></td><td><a class="user" id="'+item.userName+'"><canvas class="demo" title="' + item.userName + '"alt="Pranjal" style="width:34px; height:34px; margin:-12px 10px; border-radius:50%;"></canvas></a></td><td>' + item.numReplies + '</td><td>' + item.views + '</td><td><span class="badge badge-primary"><span class="oi oi-star"></span>'+item.rating+'</span></td></tr>';

    });
    $('#table').append(data);
    $('a.threadclick').click(function () {
      var id = $(this).attr('id');
      alert(id);
      window.location = '/thread/' + id;
    });
    $('a.user').click(function () {
      var title = $(this).attr('id');
      alert(title);
      window.location="users/profile/"+title;
    });
      $(".demo").letterpic();

});

$('#mypost').click(function() {

  $("#table").find("tr:gt(0)").remove();
  var data = "";
  $.each(document.categories, function (i, item) {
    if(item.userName==Cookies.get('userName')){
    data += '<tr><th scope="row">' + document.cat + '</th><td><a class="threadclick" id="' + item.id + '">Why are mobiles black? Are they good?</a></td><td><a class="user" id="'+item.userName+'"><canvas class="demo" title="' + item.userName + '"alt="Pranjal" style="width:34px; height:34px; margin:-12px 10px; border-radius:50%;"></canvas></a></td><td>' + item.numReplies + '</td><td>' + item.views + '</td><td><span class="badge badge-primary"><span class="oi oi-star"></span>'+item.rating+'</span></td></tr>';
}
  });
  $('#table').append(data);
  $('a.threadclick').click(function () {
    var id = $(this).attr('id');
    alert(id);
    window.location = '/thread/' + id;
  });
  $('a.user').click(function () {
    var title = $(this).attr('id');
    alert(title);
    window.location="users/profile/"+title;
  });
    $(".demo").letterpic();

});

$('#latest').click(function() {

  document.categories.sort(predicateBy("date"));
  $("#table").find("tr:gt(0)").remove();
  var data = "";
  $.each(document.categories, function (i, item) {
    data += '<tr><th scope="row">' + document.cat + '</th><td><a class="threadclick" id="' + item.id + '">Why are mobiles black? Are they good?</a></td><td><a class="user" id="'+item.userName+'"><canvas class="demo" title="' + item.userName + '"alt="Pranjal" style="width:34px; height:34px; margin:-12px 10px; border-radius:50%;"></canvas></a></td><td>' + item.numReplies + '</td><td>' + item.views + '</td><td><span class="badge badge-primary"><span class="oi oi-star"></span>'+item.rating+'</span></td></tr>';

  });
  $('#table').append(data);
  $('a.threadclick').click(function () {
    var id = $(this).attr('id');
    alert(id);
    window.location = '/thread/' + id;
  });
  $('a.user').click(function () {
    var title = $(this).attr('id');
    alert(title);
    window.location="users/profile/"+title;
  });
    $(".demo").letterpic();

});

});
