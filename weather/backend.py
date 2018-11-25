from flask import Flask, request, jsonify
from base import Classifier
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
classifier = Classifier()

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/api/estimate', methods=['POST'])
def return_estimate():

    json = request.get_json()
    hour = json["params"]["Hour"]
    weekday = json["params"]["Weekdays"]
    temp = json["params"]["Air_temperature_degC"]
    ws = json["params"]["Wind_speed_ms"]
    resp = {}

    for gid in json["gridIds"]:
        if gid not in classifier.validGids:
            resp[gid] = 0
        else:
            resp[gid] = classifier.classify(gid,hour,weekday,temp,ws)

    return jsonify(resp)