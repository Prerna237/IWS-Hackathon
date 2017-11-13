$(document).ready(function () {
  $('#dd .dropdown-item').click(function () {
    document.retval = $(this).text();
  });
  $("#addThreadButton").click(function () {
    alert(document.retval);
    var jobject = new Object();
    jobject.title = $("#text").val();
    jobject.desc = $("#area2").val();
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

  $('#ddd .dropdown-item').click(function () {
    // cat = $(this).text();
    var cat = "Action";
    alert(cat);
    $.ajax({
      url: '/threadsByCategory/' + cat,
      // data: {
      //   format: 'json'
      // },
      // error: function () {
      //   //something
      // },
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      async: true,
      success: function (data) {
        //some code;
        document.categories = data;
      },
      type: 'GET'
    });
  });
});