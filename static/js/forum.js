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
  if (event.target == storyModal){
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

//Save original state of tag boxes when the page was loaded
var originalBox1, originalBox2;
window.onload = function(){
  originalBox1 = document.getElementById("tag-box1").innerHTML;
  originalBox2 = document.getElementById("tag-box2").innerHTML;
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

  if (postTitle == '' || postContent == ''){
    document.getElementById('alert').style.display = 'block';
  }

  $.ajax({
      url:'/poststory',
      type: "POST",
      data: JSON.stringify({title: postTitle, content: postContent, tags: postTags}),
      contentType: "application/json; charset=UTF-8"
    });

  document.getElementById("post-title").value = '';
  document.getElementById("post-content").value = '';
  document.getElementById("tag-box1").innerHTML = originalBox1;
  document.getElementById("tag-box2").innerHTML = originalBox2;
  document.getElementById("added-story-tag").value = '';
}
