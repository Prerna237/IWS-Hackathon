$(document).ready(function () {
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

  $('#ddd .dropdown-item').click(function () {
     cat = $(this).text();
     $("#category").html(cat);
     document.cat=cat;
    $.ajax({
      url: '/threadsByCategory/' + cat,

      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      async: true,
      success: function (data) {
        //some code;
        document.categories = data;
        $("#table").find("tr:gt(0)").remove();
        var data="";
          $.each(document.categories, function(i, item) {
          data+='<tr><th scope="row">'+document.cat+'</th> <td>'+item.title+'</td> <td><img src="Pranjal.jpeg" class="rounded-circle" alt="'+item.userName+'" width="30" height="30"> </td><td>'+item.UID+'</td><td>13</td><td><span class="badge badge-primary"><span class="oi oi-star"></span> Star</span></td></tr>';
        });
        $('#table').append(data);
      },
      type: 'GET'
    });


  });


});
