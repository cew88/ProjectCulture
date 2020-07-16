from flask import Flask, render_template

app = Flask(__name__, template_folder='templates', static_folder='static')

@app.route('/')
def index():
  return render_template("index.html")
    
@app.route('/about')
def about():
  return render_template("about.html")

@app.route('/contact-us')
def contact():
  return render_template("contact.html")

@app.route('/subscribe')
def subscribe():
  return render_template("subscribe.html")

#Regional Pages

@app.route('/north-america')
def northAmerica():
  return render_template("/regions/northAmerica.html")

@app.route('/south-america')
def southAmerica():
  return render_template("/regions/southAmerica.html")

@app.route('/europe')
def europe():
  return render_template("/regions/europe.html")

@app.route('/asia')
def asia():
  return render_template("/regions/asia.html")

@app.route('/africa')
def africa():
  return render_template("/regions/africa.html")

#KEEP THIS AT THE END
if __name__ == "__main__":
  app.run(host='0.0.0.0', port=8000, debug=True)