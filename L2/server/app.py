from flask import Flask
from flask import request
from flask import make_response
app = Flask(__name__)

@app.route('/', methods=['OPTIONS'])
def options():
    app.logger.warning(" Invoked preflight endpoint ")
    response = make_response('', 200)
    response.headers["Access-Control-Allow-Origin"] = "http://friend.company.com"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return response

@app.route('/', methods=['GET','POST'])
def get_and_post():
    app.logger.warning(" Invoked regular endpoint ")
    response = make_response('{"result":"pong"}', 200)
    response.headers["Access-Control-Allow-Origin"] = "http://friend.company.com"
    return response
