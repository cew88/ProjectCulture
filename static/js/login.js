var showPassword = false;
var usernameInput = document.getElementById("username-input");
var passwordInput = document.getElementById("password-input");


$("#showPasswordButton").click(function(){
  showPassword = !showPassword
  if (showPassword){
    passwordInput.type = "text";
  }
  else{
    passwordInput.type = "password";
  }
});


document.getElementById("login-button").onclick = function(){
  $.ajax({
      url:'/verifyuser',
      type: "POST",
      data: JSON.stringify({username: usernameInput.value, password: passwordInput.value}),
      contentType: "application/json; charset=UTF-8"
    });
    
  window.open("/forum","_self");
}