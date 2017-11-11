$(document).ready(function () {

    $('#dd .dropdown-item').click(function() {
      retval=$(this).text();
      $("#addThreadButton").click(function () {
        var jobject = new Object();
        jobject.title=$("#text").val();
        jobject.desc=$("#area2").val();
        jobject.category=retval;
        jobject.userName=Cookies.get("userName");
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
});

$('#ddd .dropdown-item').click(function() {
  cat=$(this).text();
  $.ajax({
   url: '/threads/'+cat,
   data: {
      format: 'json'
   },
   error: function() {
      //something
   },
   dataType: 'jsonp',
   success: function(data) {
     //some code;

   },
   type: 'GET'
});


});
});
