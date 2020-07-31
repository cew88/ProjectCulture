

#from database import posts_collection as collection
from user import current_user

def new_post(username, title, content):
  if (current_user.is_authenticated):
    collection.update_one({"username": username}, {"$set": {"posts." + title: content}})
  else:
    return False

def delete_post(username, title):
  if (current_user.is_authenticated):
    collection.update_one({"username":username}, {"$unset": {"posts." + title: ""}})
  else:
    return False