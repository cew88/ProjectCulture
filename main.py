from flask import Flask, render_template, url_for, redirect, request, session, Response
from appinit import app

import user
from user import current_user
import posting

import json


#Clears cache
@app.after_request
def add_header(r):
	r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
	r.headers["Pragma"] = "no-cache"
	r.headers["Expires"] = "0"
	r.headers['Cache-Control'] = 'public, max-age=0'
	return r



#Nav pages
@app.route('/')
def index():
  if ("username" in session):
    return ("You are logged in as " + session["username"])
  return render_template("index.html")

@app.route('/explore')
def explore():
	return render_template("explore.html")

@app.route('/forum')
def forum():
  return render_template("forum.html")

@app.route('/contact-us')
def contact():
	return render_template("contact.html")

@app.route('/userpage')
def userpage():
  return render_template("userpage.html")

@app.route('/subscribe')
def subscribe():
	return render_template("subscribe.html")

@app.route('/login')
def login():
  return render_template("login.html")

@app.route('/signup')
def signup():
  return render_template("signup.html")


# Posting
@app.route('/getposts', methods=["GET"])
def get_posts():
  #Default arguments
  num = 10
  sort_by = "new"
  filters = {}
  parent_id = ""

  #Load arguments
  data = request.args
  if "num_posts" in data: num = int(data["num_posts"])
  if "sort_by" in data: sort_by = data["sort_by"]
  if "filter" in data: filters = json.loads(data["filter"])
  if "parent_id" in data: parent_id = str(data["parent_id"])
  
  result = posting.get_posts(num, sort_by, filters, parent_id)

  if result[0] != False:
    return Response(json.dumps(result[1]), status=200, mimetype='application/json')
  return Response(result[1], status=400)

@app.route('/getpostbyid', methods=["GET"])
def get_posts_by_ids():
  data = request.args
  ids = json.loads(data["post_ids"])
  result = posting.get_posts_by_ids(ids)
  if result[0] != False:
    return Response(json.dumps(result[1]), status=200, mimetype='application/json')
  return Response(result[1], status=400)

@app.route('/createpost', methods=["POST"])
def create_post():
  #Initialize default values
  parent_id = ""
  tags = []
  #Load values
  data = request.json
  title = data["title"]
  content = data["content"]
  if "tags" in data: tags = data["tags"]
  if "parent_id" in data: parent_id = str(data["parent_id"])
  result = posting.new_post(title, content, tags, parent_id)
  if result[0] != False:
    return Response(result[1], status=201)
  return Response(result[1], status=403)

@app.route('/votepost', methods=["POST"])
def upvote_post():
  data = request.json
  post_id = data["post_id"]
  vote = data["vote"]#1 for upvoting -1 for unupvoting
  result = posting.vote_post(post_id, vote)
  if result[0] != False:
    return Response(status=200)
  return Response(result[1], status=403)


# Users
@app.route('/verifyuser', methods=["POST"])
def verifyuser():
  data = request.json
  username = data["username"]
  password = data["password"]
  result = user.user_signin(username, password)
  if result[0] != False:
    return Response(result[1], status=200)
  return Response(result[1], status=403)

@app.route('/createnewuser', methods=["POST", "GET"])
def createnewuser():
  data = request.json
  username = data["username"]
  password = data["password"]
  result = user.user_signup(username, password)
  if result[0] != False:
    return Response(result[1], status=201)
  return Response(result[1], status=403)

@app.route('/logoutuser')
def logoutuser():
  user.user_signout()
  return redirect(url_for('forum'))


#Explore page
#Region Info. Includes Name, Subtitle, and Url.
#All sort of other things could go here. eg: flag, description
regionInfoMap = {
  "unitedstates": {
    0: {#clicking on anywhere in usa but texas returns this
      "Name": "United States of America",
      "Subtitle": "A big country",
      "Url": "/regions/unitedstates",
    },
    "texas": {#clicking on texas returns this
      "Name": "Texas, USA",
      "Subtitle": "A big state",
      "Url": "/regions/unitedstates/texas",
    },
  },
  "russia": {
    0: {
      "Name": "Russia",
      "Subtitle": "A large country",
      "Url": "/regions/russia",
    },
  },
}
#GET request endpoint to get region info and link
@app.route('/getregioninfo/<string:country>/<string:state>')
def getRegionInfo(country, state) :
  if(country in regionInfoMap) :
    if(state in regionInfoMap[country]) :
      return Response(json.dumps(regionInfoMap[country][state]), status=200, mimetype='application/json')
      
    else :
      return Response(json.dumps(regionInfoMap[country][0]), status=200, mimetype='application/json')
      
  else :
    return Response(status=404)

#Route to regions
@app.route('/regions/<string:country>')
def routeToCountry(country) :
  return render_template("/regions/{}.html".format(country))

@app.route('/regions/<string:country>/<string:state>')
def routeToState(country, state) :
  return render_template("/regions/{}/{}.html".format(country, state))




#KEEP THIS AT THE END
if __name__ == "__main__":
	app.run(host='0.0.0.0', port=8000, debug=True)
