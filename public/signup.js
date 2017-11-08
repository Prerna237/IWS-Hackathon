$(document).ready(function(){
  $("form").submit(function(){
    var jobject=new Object();

    var social_array=[$("#facebook").val(),$("#twitter").val(),$("#google").val(),$("#skype").val()];
    var interest_array = $('input:checkbox:checked.form-check-input').map(function () {
      return this.value;
    }).get();

    if($("#password").val()==$("#cpassword").val()){
     jobject.userName=$("#username").val();
	 jobject.name=$("#name").val();
	 jobject.email=$("#exampleInputEmail1").val();
	 jobject.password_hash=$("#password").val();
	 jobject.social=social_array;
	 jobject.interests=interest_array;
	 jobject.profile_type="Normal";   
		
	$.ajax({
    url: '/util/addUser',
    type: 'POST',
    data: JSON.stringify(jobject),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    async: false,
    success: function(msg) {
        window.location = '/profile';
    }
});
    }
	else{
		alert("Mismatch");
	}

  });
});
