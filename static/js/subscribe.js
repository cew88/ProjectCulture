var emailInput = document.getElementById("email-input");

document.getElementById("subscribe-button").onclick = function()
  {
  var alert = document.getElementById("alert");
  
  if (emailInput.value == "")
  {
    alert.innerHTML = "Incomplete: Please enter an email address.";
    alert.style.display = "block";
  }
    else 
    {
      document.getElementById("subscribe-button").innerHTML = "Subscribed!";
      alert.style.display = "none";
      window.alert('You will now be notified of our newest content at ' + emailInput.value);
    }
  }


  //$("#subscribe-button").click(function()
  //  {
  //    document.getElementById("subscribe-button")//.innerHTML = "Subscribed!";
  //  });