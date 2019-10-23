from jwt import decode, InvalidTokenError
from uuid import uuid4
from flask import Flask
from flask import request
from flask import make_response
from dotenv import load_dotenv
from os import getenv
load_dotenv(verbose=True)

app = Flask(__name__)
JWT_SECRET = getenv('JWT_SECRET')

@app.route('/download/<fid>')
def download(fid):
  token = request.headers.get('token') or request.args.get('token')
  if len(fid) == 0:
    return '<h1>CDN</h1> Missing fid', 404
  if token is None:
    return '<h1>CDN</h1> No token', 401
  if not valid(token):
    return '<h1>CDN</h1> Invalid token', 401
  payload = decode(token, JWT_SECRET)
  if payload.get('fid', fid) != fid:
    return '<h1>CDN</h1> Incorrect token payload', 401

  content_type = request.headers.get('Accept') or request.args.get('content_type')
  with open('/tmp/' + fid, 'rb') as f:
    d = f.read()
    response = make_response(d, 200)
    response.headers['Content-Type'] = content_type
    return response

@app.route('/upload', methods=['POST'])
def upload():
  f = request.files.get('file')
  t = request.form.get('token')
  c = request.form.get('callback')
  if f is None:
    return redirect(f"{c}?error=No+file+provided") if c \
    else ('<h1>CDN</h1> No file provided', 400)
  if t is None:
    return redirect(f"{c}?error=No+token+provided") if c \
    else ('<h1>CDN</h1> No token provided', 401)
  if not valid(t):
    return redirect(f"{c}?error=Invalid+token") if c \
    else ('<h1>CDN</h1> Invalid token', 401)

  fid, content_type = str(uuid4()), f.content_type
  f.save('/tmp/' + fid)
  f.close()

  return redirect(f"{c}?fid={fid}&content_type={content_type}") if c \
  else (f'<h1>CDN</h1> Uploaded {fid}', 200)

def valid(token):
  try:
    decode(token, JWT_SECRET)
  except InvalidTokenError as e:
    app.logger.error(str(e))
    return False
  return True

def redirect(location):
  response = make_response('', 303)
  response.headers["Location"] = location
  return response