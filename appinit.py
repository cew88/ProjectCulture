from flask import Flask
#Initialize Flask
app = Flask(__name__, template_folder='templates', static_folder='static')

app.secret_key = b'mtYkVxBRm3zuYhl5JiQTDRxBWnTddnu8'