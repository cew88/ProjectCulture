





//Save original state of tag boxes when the page was loaded
var originalBox1, originalBox2;

window.onload = function(){
  originalBox1 = document.getElementById("tag-box1").innerHTML;
  originalBox2 = document.getElementById("tag-box2").innerHTML;

  initialPostsLoad();
}

//Handle tag drag and drop
function dragStart(event) {
  event.dataTransfer.setData("text", event.target.id);
}

function allowDrop(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  var data = event.dataTransfer.getData("text");
  //console.log(data);
  event.target.appendChild(document.getElementById(data));
}

//Handle new tags
document.getElementById("add-tag-button").onclick = function(){
  newTag = document.createElement('p');
  newTag.setAttribute("ondragstart", "dragStart(event)");
  newTag.setAttribute("draggable", "true");
  newTag.setAttribute("id", document.getElementById("added-story-tag").value);
  newTag.setAttribute("class", "dragtarget");
  newTag.appendChild(document.createTextNode(document.getElementById("added-story-tag").value.trim())
  );
  document.getElementById("tag-box1").appendChild(newTag);
    document.getElementById("tag-box1").appendChild(document.createTextNode("   "));

}

//Add story to database
document.getElementById("post-content-button").onclick = function(){
  var postTitle = document.getElementById("post-title").value;
  var postContent = document.getElementById("post-content").value;
  var postTags = document.getElementById("tag-box1").textContent.match(/[A-Z]*[^A-Z]+/g) ;
  //console.log(postTags)


  var alert = document.getElementById('alert');
  if (postTitle == '' || postContent == ''){
    alert.innerHTML = "Incomplete: Please enter your title/story and include one tag.";
    alert.style.visibility = 'visible';
  }
  else {
    $.ajax({
        url:'/createpost',
        type: "POST",
        data: JSON.stringify({
          title: postTitle,
          content: postContent,
          tags: postTags,
          parent_id: '',
          }),
        contentType: "application/json; charset=UTF-8",
        success: function(result, status, xhr) {
          //Probably add a banner alert on the page to notify user of successful posting
        },
        error: function(xhr, status, error) {
         alert.innerHTML = "Error posting. Please try again.";
         alert.style.visibility = 'visible';
        }
      });
  
  //Reset values of if post was successfully submitted
  document.getElementById("post-title").value = '';
  document.getElementById("post-content").value = '';
  document.getElementById("tag-box1").innerHTML = originalBox1;
  document.getElementById("tag-box2").innerHTML = originalBox2;
  document.getElementById("added-story-tag").value = '';
  }
  
}









var postModal = document.getElementById("post-modal");
var postModalContentContainer = document.getElementById("post-modal-content-container");
var isPostModalOpen = false;
var commentArea = document.getElementById("comment-area");
var openedPostId = "";

var postsIdList = [];

class Post {
  constructor(data) {
    this.data = data;
    this.postid = data["_id"];
    if(postsIdList.includes(this.postid)) {
      this.err = true;
      return;
    }
    postsIdList.push(this.postid)
    this.votes = data["votes"];
    this.title = data["title"];
    this.username = data["username"];
    this.content = data["content"];
    this.tags = data["tags"];
    this.time = data["time"];
    if(userIsAuthenticated) {
      this.isVotedByMe = ("upvoted_by" in data && data["upvoted_by"].includes(userUsername));
      this.voteButtonLocked = false;
    }
    else {
      this.isVotedByMe = false;
      this.voteButtonLocked = true;
    }
  }
  createDom() {
    let r = document.createElement("div");
    r.classList.add("post");
    
    //TODO: MAKE UPVOTE AND USERNAME SIT AT THE BOTTOM OF THE POST DIV AND PUT COUNTER NEXT TO NUMBER OF UPVOTES
    //TODO: ALSO ADD A COMMENT ICON
    //TODO: FULL SCREEN ICON?
    //username
    let usernameDom = document.createElement("div");
    usernameDom.classList.add("post-username");
    usernameDom.appendChild(document.createTextNode(this.username));
    r.appendChild(usernameDom);

    //time
    let timeDom = document.createElement("div");
    timeDom.classList.add("post-time");
    let date = new Date(this.time * 1000);
    date = date.toLocaleString();
    timeDom.appendChild(document.createTextNode(date));
    r.appendChild(timeDom);

    //title
    let titleDom = document.createElement("a");
    titleDom.classList.add("post-title");
    titleDom.href = `/forum/post/${this.postid}`;
    titleDom.addEventListener("click", this.onTitleClick.bind(this));
    titleDom.appendChild(document.createTextNode(this.title));
    r.appendChild(titleDom);

    //content
    let contentDom = document.createElement("div");
    contentDom.classList.add("post-content");
    contentDom.appendChild(document.createTextNode(this.content));
    r.appendChild(contentDom);

    //tags
    let tagsDom = document.createElement("div");
    tagsDom.classList.add("post-tags");
    if(this.tags !== null) {
      for (let i=0; i<this.tags.length; i++) {
        let tagElem = document.createElement("div");
        tagElem.classList.add("post-tags-tag");
        tagElem.appendChild(document.createTextNode(this.tags[i]));
        tagsDom.appendChild(tagElem);
      }
    }
    r.appendChild(tagsDom);

    //votes
    let votesDom = document.createElement("div");
    votesDom.classList.add("post-votes");
    let upvoteButton = document.createElement("img");
    upvoteButton.setAttribute("src", "/static/images/upvote.png");
    upvoteButton.classList.add("post-votes-button");
    upvoteButton.addEventListener("click", this.onVoteButtonClick.bind(this));
    votesDom.appendChild(upvoteButton);
    
    let votesCountText = document.createElement("div");
    votesCountText.innerText = this.votes;
    votesCountText.classList.add("post-votes-text");
    
    votesDom.appendChild(votesCountText);
    r.appendChild(votesDom);

    return {domObj: r, upvoteButton: upvoteButton, votesCountText: votesCountText};
  }
  createModalDom() {
    let c = this.createDom();
    this.modalDomUpvoteButton = c.upvoteButton;
    this.modalDomVotesCountText = c.votesCountText;
    this.modalDom = c.domObj;
    this.modalDom.classList.add("post-modal-content");
    this.updateModalDomVotes();
    return this.modalDom;

  }
  createPreviewDom() {
    let c = this.createDom();
    this.previewDomUpvoteButton = c.upvoteButton;
    this.previewDomVotesCountText = c.votesCountText;
    this.previewDom = c.domObj;
    this.previewDom.classList.add("post-preview");
    this.updatePreviewDomVotes();
    return this.previewDom;
  }
  updatePreviewDomVotes() {
    if(this.previewDom !== undefined) {
      if(this.isVotedByMe) {
        this.previewDomUpvoteButton.classList.add("post-votes-button-upvoted");
      }
      else {
        this.previewDomUpvoteButton.classList.remove("post-votes-button-upvoted");
      }
      if(this.voteButtonLocked) {
        this.previewDomUpvoteButton.classList.add("post-votes-button-locked");
      }
      else {
        this.previewDomUpvoteButton.classList.remove("post-votes-button-locked");
      }
      
      this.previewDomVotesCountText.innerText = this.votes;
    }
  }
  updateModalDomVotes() {
    if(this.modalDom !== undefined) {
      if(this.isVotedByMe) {
        this.modalDomUpvoteButton.classList.add("post-votes-button-upvoted");
      }
      else {
        this.modalDomUpvoteButton.classList.remove("post-votes-button-upvoted");
      }
      if(this.voteButtonLocked) {
        this.modalDomUpvoteButton.classList.add("post-votes-button-locked");
      }
      else {
        this.modalDomUpvoteButton.classList.remove("post-votes-button-locked");
      }
      
      this.modalDomVotesCountText.innerText = this.votes;
    }
  }
  onTitleClick(e) {
    e.preventDefault();
    if(!isPostModalOpen) {
      this.openInModal();
    }
  }
  async onVoteButtonClick() {
    if(this.voteButtonLocked) return;
    else this.voteButtonLocked = true;
    this.updatePreviewDomVotes();
    this.updateModalDomVotes();

    let vote;
    if(this.isVotedByMe) vote = -1;
    else vote = 1;
    let reqUrl = '/votepost';
    try { 
      let res = await fetch(reqUrl,{
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({post_id: this.postid, vote: vote})
      });
      if(!res.ok) console.error(await res.text());
      else {
        this.votes += vote;
        this.isVotedByMe = (vote == 1);
      }
    }
    catch(err) {
      console.error(err);
      
    }
    finally {
      this.voteButtonLocked = false;
      this.updatePreviewDomVotes();
      this.updateModalDomVotes();
    }
  }
  openInModal() {
    isPostModalOpen = true;
    postModalContentContainer.innerHTML = "";
    postModalContentContainer.appendChild(this.createModalDom());
    postModal.classList.add("post-modal-shown");
  }
}

class Comment {
  constructor(data) {
    this.data = data;
    this.postid = data["_id"];
    this.username = data["username"];
    this.content = data["content"];
    this.time = data["time"];
  }
  createDom() {
    let r = document.createElement("div");
    r.classList.add("comment");
    
    //username
    let usernameDom = document.createElement("div");
    timeDom.classList.add("comment-username");
    usernameDom.appendChild(document.createTextNode(username));
    r.appendChild(usernameDom);

    //time
    let timeDom = document.createElement("div");
    timeDom.classList.add("comment-time");
    let date = new Date(this.time * 1000);
    date = date.toLocaleString();
    timeDom.appendChild(document.createTextNode(date));
    r.appendChild(timeDom);

    //content
    let contentDom = document.createElement("div");
    timeDom.classList.add("comment-content");
    contentDom.appendChild(document.createTextNode(content));
    r.appendChild(contentDom);

    return {domObj: r};
  }
  createDom() {
    c = createDom();
    this.dom = c.domObj;
  }
}

let postGrid = document.getElementById("post-grid");
class ChronologicalPostsLoader {
  constructor(sort_by, filters) {
    this.filters = filters;
    this.locked = false;
    this.sort_by = sort_by;
    if(sort_by == "new") {
      this.cursorKey = "before_time";
      this.cursorVal = Math.round((new Date()).getTime() / 1000);
    }
    else if(sort_by == "old") {
      this.cursorKey = "after_time";
      this.cursorVal = 0;
    }
    else {
      this.err = true;
      return;
    }
  }
  async load_posts(num, callback=function() {return undefined;}) {
    if(this.locked) return false;
    else this.locked = true;
    this.filters[this.cursorKey] = this.cursorVal;
    let reqUrl = '/getposts?' +
    `num_posts=${num}&` +
    `sort_by=${this.sort_by}&` +
    `filter=${JSON.stringify(this.filters)}`;
    try {
      let res = await fetch(
        reqUrl,
        {method: 'GET', credentials: 'same-origin',},
      );
      let postsData = await res.json();
      console.log(postsData);
      for(let i=0; i<postsData.length; i++) {
        let post = new Post(postsData[i]);
        if(post.err === undefined) {
          postGrid.appendChild(post.createPreviewDom());
        }
      }
      this.cursorVal = postsData[postsData.length - 1]["time"];
      this.locked = false;
      callback();
    }
    catch(err) {
      console.error(err);
      this.locked = false;
      callback();
    }
  }
}

var loader;
var isFeaturedPostLoaded = false;
var isFirstPostsBatchLoaded = false;
async function initialPostsLoad() {
  loader = new ChronologicalPostsLoader("new", {});
  //Load featured post
  let last24Hours = Math.round((new Date()).getTime() / 1000 - 86400);
  let reqUrl = '/getposts?' +
  `num_posts=1&` +
  `sort_by=most_votes&` +
  `filter={"after_time": "${last24Hours}"}`;
  try {
    let res = await fetch(
      reqUrl,
      {method: 'GET', credentials: 'same-origin',},
    );
    let postsData = await res.json();
    console.log(postsData);
    let post = new Post(postsData[0]);
    let featuredContainer = document.getElementById("featured-story-post-content-container");
    featuredContainer.appendChild(post.createPreviewDom());
    isFeaturedPostLoaded = true;
  }
  catch(err) {
    console.error(err);
  }
  finally {
    loader.load_posts(10);
  }
}

function closePostModal() {
  isPostModalOpen = false;
  postModal.classList.remove("post-modal-shown");
  postModalContentContainer.innerHTML = "";
  commentArea.innerHTML = "";
  openedPostId = "";
}
postModal.onclick = function(e) {
  if(e.target.id === "post-modal") {
    closePostModal();
  }
}








//code graveyard


/*
//Add comment to database
document.getElementById("comment-content-button").onclick = function(){
  var commentTitle = document.getElementById("comment-title").value;
  var commentContent = document.getElementById("comment-content").value;

  var alert = document.getElementById('alert');

  if (commentTitle == '' || commentContent == ''){
      alert.innerHTML = "Incomplete: Please enter a username/password.";
      alert.style.display = 'block';
  }
  else {
    $.ajax({
        url:'/createpost',
        type: "POST",
        data: JSON.stringify({
          title: commentTitle,
          content: commentContent,
          parent_id: openedPostId,
          }),
        contentType: "application/json; charset=UTF-8",
        success: function(result, status, xhr) {
          commentModal.style.display = 'none';
          //Probably add a banner alert on the page to notify user of successful posting
        },
        error: function(xhr, status, error) {
         alert.innerHTML = "Error commenting. Please try again.";
         alert.style.display = 'block';
        }
      });
  }

  //Reset values of compose story modal
  document.getElementById("comment-title").value = '';
  document.getElementById("comment-content").value = '';
}


async function loadNewPostsBefore(num, before_time) {
  let reqUrl = '/getposts?' +
  `num_posts=${num}&` +
  `sort_by=new&` +
  `filter={"before_time": ${before_time}}`;
  let res = await fetch(
    reqUrl,
    {method: 'GET',},
    );
  let posts = await res.json();
  console.log(posts);
  putPostToFeatured(posts[0]);
  addPostsToPostGrid(posts.slice(1));
  
}

async function loadNewCommentsBeforeForPostId(num, before_time, post_id) {
  let reqUrl = '/getposts?' +
  `num_posts=${num}&` +
  `sort_by=new&` +
  `filter={"before_time": ${before_time}}&` +
  `parent_id=${post_id}`;
  let res = await fetch(
    reqUrl,
    {method: 'GET',},
    );
  let comments = await res.json();
  addCommentsToCommentGrid(comments);
}

async function votePostId(postid, vote, successCallback, errorCallbakc) {
  let reqUrl = '/votepost';
  prm = fetch(
    reqUrl,
    {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        _id: postid,
        vote: vote
      })
    }
  );
  prm.then(async function(res) {
    if(!res.ok) {
      console.error(await res.text());
    }
    else {
      successCallback();
    }
  });
  prm.catch(async function(err) {
    console.error(err);
  });
}


function createPostDom(post) {
  let r = document.createElement("div");
  for (let key in post){
    //Change unix time to date and time 
    if (key == "time"){
      date = new Date(post[key] * 1000);
      date = date.toLocaleString();
      //postContent = document.createElement("div");
      //postContent.appendChild(document.createTextNode(date));
    }
    else {
      postContent = document.createElement("div");      
      if (key != "_id" && key != "parent_id"){
        if (key == "tags") {
          let tags = "";
          for (let i=0; i<post["tags"].length; i++){
            if (i == 0){
              tags += post["tags"][i].toUpperCase();
            }
            else {
              tags += ", " + post["tags"][i].toUpperCase();
            }
          }
          postContent.appendChild(document.createTextNode(tags));
        }
        else {
          postContent.appendChild(document.createTextNode(post[key]));
        }
      }
    }
    postContent.className = key;

    //Create post-cards for the rest of the cards
    r.appendChild(postContent);
  }
  let postid = post["_id"];
  let upvoteBtn = document.createElement("img");
  upvoteBtn.setAttribute("src", "/static/images/upvote.png");
  upvoteBtn.classList.add("upvote-button");
  if(userIsAuthenticated && "upvoted_by" in post && post["upvoted_by"].includes(userUsername)) {
    upvoteBtn.dataset.isUpvoted = true;
    upvoteBtn.classList.add("upvoted");
  }
  else {
    upvoteBtn.dataset.isUpvoted = false;
  }
  upvoteBtn.onclick = function() {
    if(upvoteBtn.dataset.isUpvoted) {
      votePostId(postid, 1, function() {
        upvoteBtn.classList.add("upvoted");
        upvoteBtn.dataset.isUpvoted = true;
      },);
    }
    else {
      votePostId(postid, -1, function() {
        upvoteBtn.classList.remove("upvoted");
        upvoteBtn.dataset.isUpvoted = false;
      },);
    }
  };
  r.appendChild(upvoteBtn);
  r.classList.add("post");
  return r;
}

function createPostPreviewDom(post) {
  let r = document.createElement("a");
  r.appendChild(createPostDom(post));
  let postid = post["_id"];
  r.href = "/forum/post/" + postid;
  r.onclick = function(e) {
    e.preventDefault();
    openPostViewFor(post);
  };
  return r;
}
function createCommentDom(post) {
  let r = document.createElement("div");
  r.appendChild(createPostDom(post));
  let postid = post["_id"];
  return r;
}

function putPostToFeatured(post) {
  let featured = document.getElementById("featured-story-post");
    
  let upvote = document.createElement("img");
  upvote.setAttribute("src", "/static/images/upvote.png");
  upvote.setAttribute("class", "upvote-button");
  featured.appendChild(upvote);
  //TODO: MAKE UPVOTE AND USERNAME SIT AT THE BOTTOM OF THE POST DIV AND PUT COUNTER NEXT TO NUMBER OF UPVOTES
  //TODO: ALSO ADD A COMMENT ICON
  //TODO: FULL SCREEN ICON?

  let postElem = createPostPreviewDom(post);
  featured.appendChild(postElem);  
}

function addPostsToPostGrid(posts) {
  let postGrid = document.getElementById("post-grid");
  for (let i=0; i<posts.length; i++){
    post = createPostPreviewDom(posts[i]);
    postCard = document.createElement("div");
    postCard.classList.add("post-card");
    postCard.appendChild(post);
    postGrid.appendChild(postCard);
  }
}

function addCommentsToCommentGrid(posts) {
  let postGrid = document.getElementById("comment-grid");
  for (let i=0; i<posts.length; i++){
    post = createCommentDom(posts[i]);
    postCard = document.createElement("div");
    postCard.classList.add("comment-card");
    postCard.appendChild(post);
    postGrid.appendChild(postCard);
  }
}


function openPostViewFor(post) {
  var postElem = createPostDom(post);
  postViewPost.appendChild(postElem);
  openedPostId = post["_id"];
  postView.classList.add("post-modal-shown");
  let ts = Math.round((new Date()).getTime() / 1000);
  loadNewCommentsBeforeForPostId(50, ts, openedPostId);
}

*/