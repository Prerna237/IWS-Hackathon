$(document).ready(function () {
  if(Cookies.get("loginStatus")=="FAIL"){
    alert("Login Failed");
    Cookies.remove("loginStatus")

  }
  $.ajax({
    url: '/trending',

    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    async: true,
    success: function (data) {
      //some code;
      document.trends = data;

      document.getElementById('content').innerHTML="";
      var data = "";
      var i=0;
      $.each(document.trends, function (i, item) {
        if(Cookies.get("userName")==undefined || document.interests.length){
          i++;
          data += '<div class="row"><div class="col-2"><a class="user" id="'+item.author+'"><canvas class="demo" title="' + item.author + '"alt="Pranjal" style="width:34px; height:34px; margin:5px 10px; border-radius:50%;"></canvas></a></div><div class="col-7" style="padding-left: 0px"><a class="threadclick" id="' + item.id + '">'+item.title+'</a></div><div class="col-2"><span class="badge badge-tab badge-secondary">'+item.category+'</span></div></div>';
          if(i<5){
            data+='<hr>';
        }
        if(i==5) return false;
      }
      else{
        if(document.interests.includes(item.category)){
        i++;
        data += '<div class="row"><div class="col-2"><a class="user" id="'+item.author+'"><canvas class="demo" title="' + item.author + '"alt="Pranjal" style="width:34px; height:34px; margin:5px 10px; border-radius:50%;"></canvas></a></div><div class="col-7" style="padding-left: 0px"><a class="threadclick" id="' + item.id + '">'+item.title+'</a></div><div class="col-2"><span class="badge badge-tab badge-secondary">'+item.category+'</span></div></div>';
        if(i<5){
          data+='<hr>';
      }
      if(i==5) return false;

      }
    }
    });
    $('#content').append(data);
    $('a.threadclick').click(function () {
      var id = $(this).attr('id');
      alert(id);
      window.location = '/thread/' + id;
    });

    $('a.user').click(function () {
      var title = $(this).attr('id');
      window.location="/profile/"+title;
    });
    $(".demo").letterpic();
  },
  type: 'GET'
});
$(".demo").letterpic();



});
