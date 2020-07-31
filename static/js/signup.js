var showPassword = false;
var usernameInput = document.getElementById("username-input");
var passwordInput = document.getElementById("password-input");
var confirmPasswordInput = document.getElementById
("confirmPassword-input");


$("#showPasswordButton").click(function(){
  showPassword = !showPassword
  if (showPassword){
    passwordInput.type = "text";
    confirmPasswordInput.type = "text";
  }
  else{
    passwordInput.type = "password";
    confirmPasswordInput.type = "password";
  }
});


document.getElementById("signup-button").onclick = function(){
  var alert = document.getElementById("alert");

  if (usernameInput.value == "" || passwordInput.value == "" || confirmPasswordInput.value == ""){
    alert.innerHTML = "Incomplete: Please enter a username/password.";
    alert.style.display = "block";
  }
  else if (passwordInput.value != confirmPasswordInput.value){
    alert.innerHTML = "Passwords do not match.";
    alert.style.display = "block";
  }
  else {
    alert.style.display = "none";
    $.ajax({
      url:'/createnewuser',
      type: "POST",
      data: JSON.stringify({username: usernameInput.value, password: passwordInput.value}),
      contentType: "application/json; charset=UTF-8",
      success: function(result, status, xhr) {
        console.log(result);
        window.alert("signup successful");
        window.open("/forum","_self");
      },
      error: function(xhr, status, error) {
        console.log(xhr.responseText);
        window.alert('failed');
      }
    });

  }
}