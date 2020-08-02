var storyModal = document.getElementById("post-modal");
var span = document.getElementsByClassName("close")[0];

//Open Modal
document.getElementById("post-modal-button").onclick = function(){
  storyModal.style.display = "block";
}

span.onclick = function(){
  storyModal.style.display = "none";
}

window.onclick = function(event){
  if (event.target == storyModal)
  {
    storyModal.style.display = "none";
  }
}

//Handle tag drag and drop
function dragStart(event) {
  event.dataTransfer.setData("Text", event.target.id);
}

function allowDrop(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  var data = event.dataTransfer.getData("Text");
  event.target.appendChild(document.getElementById(data));
}

async function load_new_posts(num, before_time) {
  let reqUrl = '/getposts?' +
  `num_posts=${num}&` +
  `sort_by=new&` +
  `filter={"before_time": ${before_time}}`;
  let res = await fetch(
    reqUrl,
    {method: 'GET',},
    );
  let posts = await res.json();
  //console.log(posts);

  postGrid = document.getElementById("post-grid");
  for (var i=0; i<posts.length; i++){
    if (i == 0) {
      var featured = document.getElementById("featured-story");
    }
    else {
      var post = document.createElement("div");
      post.className = "post-card";
    }

    for (var key in posts[i]){
      //Change unix time to date and time 
      if (key == "time"){
        date = new Date(posts[i][key] * 1000);
        date = date.toLocaleString();
        postContent = document.createTextNode(date);
      }
      else {
        postContent = document.createTextNode(posts[i][key]);
      }
      
      //Set classnames for elements in posts TODO: FIX STYLING, DOES NOT WORK RIGHT NOW
      postContent.className = String.valueOf(key);

      //Feature the first story TODO: FEATURED STORY SHOULD BE STORY WITH MOST UPVOTES
      if (i == 0){
        featured.appendChild(postContent);
        featured.appendChild(document.createElement("br"));
      }
      //Create post-cards for the rest of the cards
      else {
        post.appendChild(postContent);
        post.appendChild(document.createElement("br"));
        document.getElementById("post-grid").appendChild(post);
      }
    }
  }

}

//Save original state of tag boxes when the page was loaded
var originalBox1, originalBox2;
window.onload = function(){
  originalBox1 = document.getElementById("tag-box1").innerHTML;
  originalBox2 = document.getElementById("tag-box2").innerHTML;

  //Load new posts
  let ts = Math.round((new Date()).getTime() / 1000);
  load_new_posts(10, ts)
}

//Handle new tags
document.getElementById("add-tag-button").onclick = function(){
  newTag = document.createElement('p');
  newTag.setAttribute("ondragstart", "dragStart(event)");
  newTag.setAttribute("draggable", "true");
  newTag.setAttribute("id", document.getElementById("added-story-tag").value);
  newTag.setAttribute("class", "tags");
  newTag.appendChild(document.createTextNode(document.getElementById("added-story-tag").value.trim())
  );
  document.getElementById("tag-box1").appendChild(newTag);
  document.getElementById("tag-box1").appendChild(document.createTextNode("   "));
}

//Add story to database
document.getElementById("post-content-button").onclick = function(){
  var postTitle = document.getElementById("post-title").value;
  var postContent = document.getElementById("post-content").value;
  var postTags = Array.from(new Set(document.getElementById("tag-box1").textContent.split("   ").slice(1, -1)));

  var alert = document.getElementById('alert');

  if (postTitle == '' || postContent == ''){
      alert.innerHTML = "Incomplete: Please enter a username/password.";
      alert.style.display = 'block';
  }
  else {
    $.ajax({
        url:'/poststory',
        type: "POST",
        data: JSON.stringify({title: postTitle, content: postContent, tags: postTags}),
        contentType: "application/json; charset=UTF-8",
        success: function(result, status, xhr) {
          storyModal.style.display = 'none';
          //Probably add a banner alert on the page to notify user of successful posting
        },
        error: function(xhr, status, error) {
         alert.innerHTML = "Error posting. Please try again.";
         alert.style.display = 'block';
        }
      });
  }

  //Reset values of compose story modal
  document.getElementById("post-title").value = '';
  document.getElementById("post-content").value = '';
  document.getElementById("tag-box1").innerHTML = originalBox1;
  document.getElementById("tag-box2").innerHTML = originalBox2;
  document.getElementById("added-story-tag").value = '';
}
