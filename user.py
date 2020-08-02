
from appinit import app

from database import users_collection as collection


from flask_login import LoginManager, current_user, login_user, logout_user
from werkzeug.security import generate_password_hash, check_password_hash

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

class User():
  username = ""
  email = ""
  password_hash = ""

  def to_dict(self):
    return {
      "username": self.username,
      "email": self.email,
      "password_hash": self.password_hash,
    }

  def from_dict(self, d):
    if "username" in d: self.username = d["username"]
    if "email" in d: self.email = d["email"]
    if "password_hash" in d: self.password_hash = d["password_hash"]

  def __init__(self, d):
    self.from_dict(d)

  is_active = True
  is_authenticated = True
  is_anonymous = False
  
  def get_id(self):
    return self.username
  
  def set_password(self, password):
    self.password_hash = generate_password_hash(password)
  
  def check_password(self, password):
    return check_password_hash(self.password_hash, password)


@login_manager.user_loader
def load_user(user_id):
  return User(get_user("username", user_id))

def user_signin(username, password):
  if user_exists(username):
    user = User(collection.find_one({"username":username}))
    if user.check_password(password):
      login_user(user)
      return True
  return False

def user_signout():
  logout_user()

def user_signup(username, password, email=""):
  if user_exists(username):
    return False

  user = User({
    "username": username,
    "email": email
    })
  
  user.set_password(password)

  print(user)
  try:
    user = user.to_dict()
    result = collection.insert_one(user);
  except:
    return False
  else:
    return True

def get_user(field, value):
  return collection.find_one({field: value})

def user_exists(username):
  return collection.find_one({"username": username})

'''
def verify_user(username, password):
  if user_exists(username):
    result = collection.find_one({"username":username, "password":password})
    if result is None:
      return False
    if result.username == username and result.password == password:
      #just an extra check, in case the database query returns something weird
      return username
  return False

def create_user(username, password):
  if not (user_exists(username)):
    user_template = user_template();
    user_template["username"] = username;
    user_template["password"] = password;
    try:
      result = collection.insert_one(user_template);
    except:
      return False
    else:
      return username
  return False
'''