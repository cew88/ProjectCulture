from database import posts_collection as collection
from user import current_user
import time

import pymongo

def new_post(username, title, content):
  if current_user.is_authenticated:
    try:
      result = collection.insert_one({
        "username": username,
        "title": title,
        "content": content,
        "time": time.time(),
        "comments": [],
        "upvotes": 0
        })
      result = str(result.inserted_id)
    except:
      result = False
  else:
    result = False
  return result

def get_posts_by_new(num, before_time):
  try:
    result = collection.find({"time": {"$lt": float(before_time)}}).sort("time", pymongo.DESCENDING).limit(num)
    result = list(result)
    for r in result:
      del r["_id"]
  except:
    result = False
  return result



def delete_post(username, title):
  if (current_user.is_authenticated):
    collection.update_one({"username":username}, {"$unset": {"posts." + title: ""}})
  else:
    return False