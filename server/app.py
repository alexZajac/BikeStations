from flask import Flask
from flask_restful import Resource, Api, reqparse
from store import Store
from station import addData, getStation

app = Flask(__name__)
api = Api(app)

url = "http://www.owl-ontologies.com/unnamed.owl#"
store = Store("./ontologie/semanticsProject.owl")
addData(store, url)


class Home(Resource):
    def get(self):
        return {
            "ack": True
        }


class Station(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('city',  required=True,
                            help='City cannot be blank!')
        parser.add_argument('type',  required=True,
                            help='Type cannot be blank!')
        args = parser.parse_args()
        return getStation(store, args['type'], args['city'])


api.add_resource(Station, '/v1/station')
api.add_resource(Home, '/')

app.run(port=80)
