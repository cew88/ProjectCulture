#Create database
import pymongo

client = pymongo.MongoClient("mongodb+srv://projectcultureadmin:cultureadminpassword@projectculture.mciiv.mongodb.net/ProjectCulture?retryWrites=true&w=majority")
cluster = client.main
collection = cluster.users

def template():
  return {
    "username": "",
    "password": "",
    "tags": [],
    "posts": {}
  }

def user_exists(username):
  return collection.find_one({"username": username})

def verify_user(username, password):
  if user_exists(username):
    return collection.find_one({"username":username}, {"password":password})
  return False

def create_user(username, password):
  if not (user_exists(username)):
    user_template = template();
    user_template["username"] = username;
    user_template["password"] = password;
    collection.insert_one(user_template);
    return user_template;

def new_post(username, title, content):
  if (user_exists(username)):
    collection.update_one({"username": username}, {"$set": {"posts." + title: content}})

def delete_post(username, title):
  if (user_exists(username)):
    collection.update_one({"username":username}, {"$unset": {"posts." + title: ""}})

#def upvote()