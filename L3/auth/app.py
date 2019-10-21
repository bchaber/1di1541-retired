from flask import Flask
from flask import request
from flask import make_response

users = {}
app = Flask(__name__)

@app.route('/login')
def login():
  return """<!doctype html>
<head/>

<form action="/auth" method="POST">
 <input type="text" name="username"></input>
 <input type="password" name="password"></input>
 <input type="submit"/>
</form>
"""

@app.route('/')
def index():
  return """<!doctype html>
<head>
<script>
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;
xhr.onreadystatechange = function() {
  var DONE = 4;
  var OK = 200;
  if (xhr.readyState == DONE) {
    if (xhr.status == OK) {
       console.log("[xhr] Request came back with data: " + xhr.responseText);
    } else {
       console.error("[xhr] Request came back with an ERROR: " + xhr.status);
    }
  }
}

hostname = 'http://server.company.com:5000'

//// Simple Request (no preflight)
xhr.open('POST', hostname + '/pong', false);
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr.send("action%3Dping");

//// Not-So-Simple Request (with preflight)
//xhr.open('POST', hostname + '/pong', false);
//xhr.setRequestHeader('Content-Type', 'application/json');
//xhr.send(JSON.stringify({"state":"ping"}));

//// Simple Request (no preflight)
//credentials = undefined;//'include';
//headers = {'Content-Type' : 'application/x-www-form-urlencoded'};
//fetch(hostname + '/pong', { method:'POST', credentials:credentials, headers:headers, body:'action%3Dping' })

//// Not-So-Simple Request (with preflight)
//credentials = undefined;//'include';
//headers = {'Content-Type' : 'application/json'}
//fetch(hostname + '/pong', { method:'POST', credentials:credentials, headers:headers, body:'{"action":"ping"}' })
</script>
</head>

<img src="http://server.company.com:5000/cat" />
<form action="http://server.company.com:5000/pong" method="POST">
<input type="submit"/>
</form>
"""

@app.route('/welcome')
def welcome():
  username = request.cookies.get('username', 'stranger')
  return f"Hello {username}", 200

@app.route('/auth', methods=['POST'])
def auth():
  username = request.form.get('username')
  password = request.form.get('password')

  response = make_response('', 303)
  response.set_cookie("session_id", "deadbeef", max_age=180)
  response.set_cookie("username", username)
  response.headers["Location"] = "/welcome"

  return response




















@app.route('/pong', methods=['OPTIONS'])
def preflight():
  response = make_response('', 200)
  #response.headers['Access-Control-Allow-Origin'] = "http://friend.company.com:5000"
  #response.headers['Access-Control-Allow-Headers'] = "Content-Type"
  #response.headers['Access-Control-Allow-Credentials'] = "true"
  app.logger.warning("[preflight] Cookie: " + request.headers.get("Cookie","(none)"))
  return response

@app.route('/pong', methods=['GET','POST'])
def pong():
  response = make_response('{"result":"pong"}', 200)
  #response.headers['Access-Control-Allow-Origin'] = "http://friend.company.com:5000"
  #response.headers['Access-Control-Allow-Headers'] = "Content-Type"
  #response.headers['Access-Control-Allow-Credentials'] = "true"
  app.logger.warning("[regular]   Cookie: " + request.headers.get("Cookie","(none)"))
  return response
