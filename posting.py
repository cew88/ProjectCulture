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
  #subpost_ids = []


  def to_dict(self):
    return {
      "username": self.username,
      "title": self.title,
      "content": self.content,
      "time": self.time,
      "tags": self.tags,
      "votes": self.votes,
      "parent_id": self.parent_id,
      #"subpost_ids": self.subpost_ids,
    }

  def from_dict(self, d):
    if "username" in d: self.username = d["username"]
    if "title" in d: self.title = d["title"]
    if "content" in d: self.content = d["content"]
    if "tags" in d: self.tags = d["tags"]
    if "time" in d: self.time = d["time"]
    if "votes" in d: self.votes = d["votes"],
    if "parent_id" in d: self.parent_id = d["parent_id"]
    #if "subpost_ids" in d: self.subpost_ids = d["subpost_ids"]

  def __init__(self, d):
    self.from_dict(d)


  
    


def prepare_query_result_for_json(r):
  for i in r:
    i["_id"] = str(i["_id"])
  return r


def new_post(title, content, tags, parent_id):
  if current_user.is_authenticated:
    if parent_id != "":
      if len(parent_id) == 24:
        if collection.find({"_id": ObjectId(parent_id)}).limit(1).size() <= 0:
          return (False, "Parent post not found")
      else:
        return (False, "Parent post not found")
    
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



'''

def get_posts_by_new(num, before_time):
  try:
    result = collection.find({"time": {"$lt": float(before_time)}}).sort("time", pymongo.DESCENDING).limit(num)
    result = list(result)

    result = prepare_query_result_for_json(result)

    result = (True, result)
  except:
    result = (False, "Databse failed")
  return result
'''
def get_posts(num, sort_by, filt={}, parent_id=""):
  def get_query_args(d):
    filt = {}
    filt_time = {}
    if "before_time" in d and float(d["before_time"]) > 0:
      filt_time["$lt"] = float(d["before_time"])
    if "after_time" in d and float(d["after_time"]) > 0:
      filt_time["$gt"] = float(d["after_time"])
    if len(filt_time) > 0:
      filt["time"] = filt_time
    if "username" in d and d["username"] != "":
      filt["username"] = d["username"]
    if "tags" in d and len(d["tags"]) > 0:
      filt["tags"] = {"$all": d["tags"]}
    filt_votes = {}
    if "max_votes" in d and int(d["max_votes"]) > 0:
      filt_votes["$lt"] = int(d["max_votes"])
    if "min_votes" in d and int(d["min_votes"]) > 0:
      filt_votes["$gt"] = int(d["min_votes"])
    if len(filt_votes) > 0:
      filt["votes"] = filt_votes
    if len(parent_id) == 24:
      filt["parent_id"] = ObjectId(parent_id)
    return filt

  def get_sort_args(sort_by):
    if sort_by == "new":
      return ("time", pymongo.DESCENDING)
    if sort_by == "old":
      return ("time", pymongo.ASCENDING)
    if sort_by == "most_votes":
      return ("votes", pymongo.DESCENDING)
    if sort_by == "least_votes":
      return ("votes", pymongo.ASCENDING)
    return ("time", pymongo.DESCENDING)

  try:
    qarg = get_query_args(filt)
    sarg = get_sort_args(sort_by)
    result = collection.find(qarg).sort(*sarg).limit(num)
    result = list(result)
    result = prepare_query_result_for_json(result)
    result = (True, result)
  except: 
    result = (False, "Database failed")
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