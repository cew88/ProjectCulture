from flask import Flask, render_template, Response
import json

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

def user_exists(field, value):
  return collection.find_one({field: value})

def create_user(username, password):
  if not (user_exists("username", username)):
    user_template = template();
    user_template["username"] = username;
    user_template["password"] = password;
    collection.insert_one(user_template);
    return user_template;

create_user("hello", "world");

#Initialize Flask
app = Flask(__name__, template_folder='templates', static_folder='static')

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


@app.route('/subscribe')
def subscribe():
	return render_template("subscribe.html")


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
