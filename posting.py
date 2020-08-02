from database import posts_collection as collection
from user import current_user
import time as timelib

import json

import pymongo
from bson.objectid import ObjectId


class Post():
  username = ""
  title = ""
  content = ""
  time = 0
  
  tags = []
  
  votes = 0

  parent_id = ""
  subpost_ids = []


  def to_dict(self):
    return {
      "username": self.username,
      "title": self.title,
      "content": self.content,
      "time": self.time,
      "tags": self.tags,
      "votes": self.votes,
      "parent_id": self.parent_id,
      "subpost_ids": self.subpost_ids,
    }

  def from_dict(self, d):
    if "username" in d: self.username = d["username"]
    if "title" in d: self.title = d["title"]
    if "content" in d: self.content = d["content"]
    if "tags" in d: self.tags = d["tags"]
    if "time" in d: self.time = d["time"]
    if "votes" in d: self.votes = d["votes"],
    if "parent_id" in d: self.parent_id = d["parent_id"]
    if "subpost_ids" in d: self.subpost_ids = d["subpost_ids"]

  def __init__(self, d):
    self.from_dict(d)

  def upvote(self):
    return (False, "Not implemented yet")

  def unupvote(self):
    #this isn't downvote. this is when you upvoted and change your mind
    return (False, "Not implemented yet")
  
  def add_subpost(self, subpost_id):
    if subpost_id in self.subpost_ids:
      return (False, "Already present?!")
    subpost_ids.add(subpost_id)
    return (True, "")

def prepare_query_result_for_json(r):
  for i in r:
    i["_id"] = str(i["_id"])
  return r

def new_post(title, content, tags, parent_id):
  if current_user.is_authenticated:
    post = Post({
      "username": current_user.username,
      "title": title,
      "content": content,
      "tags": tags,
      "time": timelib.time(),
      "parent_id": parent_id,
    })
    try:
      postdict = post.to_dict()
      result = collection.insert_one(postdict)
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

    result = prepare_query_result_for_json(result)

    result = (True, result)
  except:
    result = (False, "Databse failed")
  return result

def get_posts_by_ids(ids):
  idl = [ObjectId(i) for i in ids]
  try:
    result = collection.find({"_id": {"$in": idl}}).limit(len(idl))
    result = list(result)

    result = prepare_query_result_for_json(result)

    result = (True, result)
  except:
    result = (False, "Databse failed")
  return result

def delete_post(username, title):
  if (current_user.is_authenticated):
    collection.update_one({"username":username}, {"$unset": {"posts." + title: ""}})
  else:
    return False