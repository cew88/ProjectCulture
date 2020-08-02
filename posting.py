from database import posts_collection as collection
from user import current_user
import time as timelib

import json

import pymongo


class Post():
  username = ""
  title = ""
  content = ""
  post_time = 0
  
  votes = 0

  parent_id = ""
  subpost_ids = {}


  def to_dict(self):
    return {
      #"post_id": self.post_id,
      "username": self.username,
      "title": self.title,
      "content": self.content,
      "time": self.time,
      "votes": self.votes,
      "subpost_ids": json.dumps(self.subpost_ids),
    }

  def from_dict(self, d):
    #if "post_id" in d: self.post_id = d["post_id"]
    if "username" in d: self.username = d["username"],
    if "title" in d: self.title = d["title"],
    if "content" in d: self.content = d["content"],
    if "time" in d: self.time = d["time"],
    if "votes" in d: self.votes = d["votes"],
    if "subpost_ids" in d: self.subpost_ids = json.loads(d["subpost_ids"])

  def __init__(self, d):
    self.from_dict(d)

  def upvote(self):
    return (False, "Not implemented yet")

  def unupvote(self):
    return (False, "Not implemented yet")
  
  def add_subpost(self, subpost_id):
    if subpost_id in self.subpost_ids:
      return (False, "Already present?!")
    subpost_ids.add(subpost_id)
    return (True, "")


def new_post(title, content):
  if current_user.is_authenticated:
    post = Post({
      "username": current_user.username,
      "title": title,
      "content": content,
      "time": timelib.time(),
    })
    try:
      result = collection.insert_one(post.to_dict());
      result = (True, str(result.inserted_id))
    except:
      result = (False, "Database failed")
  else:
    result = (False, "Not authenticated")
  return result

def get_posts_by_new(num, before_time):
  try:
    result = collection.find({"time": {"$lt": float(before_time)}}).sort("time", pymongo.DESCENDING).limit(num)
    result = list(result)

    #for r in result:
    #  r = Post(r)

    for r in result:
      r["post_id"] = str(r["_id"])
      del r["_id"]

    result = (True, result)
  except:
    result = (False, "Databse failed")
  return result



def delete_post(username, title):
  if (current_user.is_authenticated):
    collection.update_one({"username":username}, {"$unset": {"posts." + title: ""}})
  else:
    return False