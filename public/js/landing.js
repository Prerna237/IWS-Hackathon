$(document).ready(function () {
if(Cookies.get("userName")==undefined){
  $.ajax({
    url: '/threadsByCategory/Category1',

    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    async: true,
    success: function (data) {
      //some code;
      document.trends = data;
      document.getElementById('content').innerHTML="";
      var data = "";
      $.each(document.trends, function (i, item) {
        data += '<div class="row"><div class="col-2"><a class="user" id="'+item.userName+'"><canvas class="demo" title="' + item.userName + '"alt="Pranjal" style="width:34px; height:34px; margin:5px 10px; border-radius:50%;"></canvas></a></div><div class="col-8" style="padding-left: 0px"><a class="threadclick" id="' + item.id + '">Some bullshit that this guy posted some time ago on this stupid category.</a></div><div class="col-2"><span class="badge badge-tab badge-secondary"> Category1</span></div></div><hr>';

      });
      $('#content').append(data);
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
    $(".demo").letterpic();


  }
});
