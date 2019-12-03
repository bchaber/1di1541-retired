from flask import Flask
from flask_hal import HAL, document

app = Flask(__name__)
HAL(app)

@app.route('/hello')
def hello():
    return document.Document(data={
        'message': 'Hello World'
    })
