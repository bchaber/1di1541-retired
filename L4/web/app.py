from jwt import encode
from uuid import uuid4
from flask import Flask
from flask import request
from flask import make_response
from dotenv import load_dotenv
from os import getenv
import datetime
load_dotenv(verbose=True)

session = {}
users = {('admin', 'password')}

HTML = """<!doctype html>
<head><meta charset="utf-8"/></head>"""

app = Flask(__name__)
CDN = getenv("CDN_HOST")
WEB = getenv("WEB_HOST")
SESSION_TIME = int(getenv("SESSION_TIME"))
JWT_SESSION_TIME = int(getenv('JWT_SESSION_TIME'))
JWT_SECRET = getenv("JWT_SECRET")
INVALIDATE = -1

@app.route('/')
def index():
  session_id = request.cookies.get('session_id')
  response = redirect("/welcome" if session_id else "/login")
  return response

@app.route('/login')
def login():
  return f"""{HTML}
  <h1>APP</h1>
  <form action="/auth" method="POST">
    <input type="text"     name="username" placeholder="Username"></input>
    <input type="password" name="password" placeholder="Password"></input>
    <input type="submit"/>
  </form>"""

@app.route('/welcome')
def welcome():
  session_id = request.cookies.get('session_id')
  if session_id:
    if session_id in session:
      fid, content_type = session[session_id]
    else:
      fid, content_type = '', 'text/plain'
        
    download_token = create_download_token(fid).decode('ascii')
    upload_token = create_upload_token().decode('ascii')
    return f"""{HTML}
    <h1>APP</h1>
    <a href="{CDN}/download/{fid}?token={download_token}&content_type={content_type}">{fid}</a>

    <form action="{CDN}/upload" method="POST" enctype="multipart/form-data">
      <input type="file" name="file"/>
      <input type="hidden" name="token"    value="{upload_token}" />
      <input type="hidden" name="callback" value="{WEB}/callback" />
      <input type="submit"/>
    </form> """
  return redirect("/login")

@app.route('/auth', methods=['POST'])
def auth():
  username = request.form.get('username')
  password = request.form.get('password')

  response = make_response('', 303)

  if (username, password) in users:
    session_id = str(uuid4())
    response.set_cookie("session_id", session_id, max_age=SESSION_TIME)
    response.headers["Location"] = "/welcome"
  else:
    response.set_cookie("session_id", "INVALIDATE", max_age=INVALIDATE)
    response.headers["Location"] = "/login"

  return response

@app.route('/logout')
def logout():
  response = redirect("/login")
  response.set_cookie("session_id", "INVALIDATE", max_age=INVALIDATE)
  return response

@app.route('/callback')
def uploaded():
  session_id = request.cookies.get('session_id')
  fid = request.args.get('fid')
  err = request.args.get('error')
  if not session_id:
    return redirect("/login")

  if err:
    return f"<h1>APP</h1> Upload failed: {err}", 400
  if not fid:
    return f"<h1>APP</h1> Upload successfull, but no fid returned", 500
  content_type = request.args.get('content_type','text/plain')
  session[session_id] = (fid, content_type)
  return f"<h1>APP</h1> User {session_id} uploaded {fid} ({content_type})", 200

def create_download_token(fid):
  exp = datetime.datetime.utcnow() + datetime.timedelta(seconds=JWT_SESSION_TIME)
  return encode({"iss":"web.company.com", "exp":exp}, JWT_SECRET, "HS256")

def create_upload_token():
  exp = datetime.datetime.utcnow() + datetime.timedelta(seconds=JWT_SESSION_TIME)
  return encode({"iss":"web.company.com", "exp":exp}, JWT_SECRET, "HS256")

def redirect(location):
  response = make_response('', 303)
  response.headers["Location"] = location
  return response
