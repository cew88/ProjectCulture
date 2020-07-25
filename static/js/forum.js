document.getElementById("post-story").onclick = function(){
  $.ajax({
      url:'/poststory',
      type: "POST",
      data: JSON.stringify({title: "hello", content: "world"}),
      contentType: "application/json; charset=UTF-8",
      success: function(response){
        console.log("woohoo")
      }
    });
}