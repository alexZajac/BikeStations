from flask import Flask
from flask_restful import Resource, Api, reqparse
from station import addDataInStore, getStation
from ride import getRide

app = Flask(__name__)
api = Api(app)


class Home(Resource):
    def get(self):
        return {
            "ack": True
        }
    
class AddData(Resource):
    def get(self):
        addDataInStore()
        return {
            "updated": True
        }


class Station(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('city',  required=True,
                            help='City cannot be blank!')
        parser.add_argument('type',  required=True,
                            help='Type cannot be blank!')
        args = parser.parse_args()
        return getStation(args['type'], args['city'])


class Ride(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('start',  required=True,
                            help='start cannot be blank!')
        parser.add_argument('end',  required=True,
                            help='end cannot be blank!')
        args = parser.parse_args()
        return getRide(args['start'],args['end'])

api.add_resource(Station, '/v1/station')
api.add_resource(AddData, '/v1/addData')
api.add_resource(Ride, '/v1/ride')
api.add_resource(Home, '/')

if __name__ == "__main__":
    app.run()
