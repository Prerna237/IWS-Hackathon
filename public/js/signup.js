$(document).ready(function () {
  $("#submitBtn").click(function () {
    var jobject = new Object();

    var social_array = [$("#facebook").val(), $("#twitter").val(), $("#google").val(), $("#skype").val()];
    var interest_array = $('input:checkbox:checked.form-check-input').map(function () {
      return this.value;
    }).get();

    if ($("#password").val() == $("#cpassword").val()) {
      jobject.userName = $("#username").val();
      jobject.name = $("#name").val();
      jobject.email = $("#exampleInputEmail1").val();
      jobject.password = $("#password").val();
      jobject.social = social_array;
      jobject.interests = interest_array;
      

      $.ajax({
        url: '/util/addUser',
        type: 'POST',
        data: JSON.stringify(jobject),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: false,
        success: function (msg) {
          console.log("MSG: " + JSON.stringify(msg));
          // var m = JSON.parse(msg);
          if (msg.status === "Failure") {
            console.log("Fuck off");
            alert("Username already in use");
          } else {
            window.location = '/profile';
          }
        }
      });
    } else {
      alert("Mismatch");
    }

  });
});
