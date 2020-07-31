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
  var alert = document.getElementById("alert");

  if (usernameInput.value == "" || passwordInput.value == ""){
    alert.innerHTML = "Incomplete: Please enter a username/password.";
    alert.style.display = "block";
  }
  else {
    alert.style.display = "none";
    $.ajax({
      url:'/createnewuser',
      type: "POST",
      data: JSON.stringify({username: usernameInput.value, password: passwordInput.value}),
      contentType: "application/json; charset=UTF-8"
    });

    window.open("/forum","_self");
  }
}