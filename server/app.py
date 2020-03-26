from flask import Flask
from flask_restful import Resource, Api, reqparse
from app.station import addDataInStore, getStation
from app.trip import getTrip

app = Flask(__name__)
api = Api(app)

# Default endpoint
class Home(Resource):
    def get(self):
        return {
            "ack": True
        }

# Update data in TripleStore
class UpdateData(Resource):
    def get(self):
        addDataInStore()
        return {
            "updated": True
        }

# Get stations data
class Station(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('city',  required=True,
                            help='City cannot be blank!')
        parser.add_argument('type',  required=True,
                            help='Type cannot be blank!')
        parser.add_argument('realtime',  required=True,
                            help='end cannot be blank!')
        args = parser.parse_args()
        return getStation(args['type'], args['city'], 'true' == args['realtime'].lower())


# Get trip data
class Trip(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('start',  required=True,
                            help='start cannot be blank!')
        parser.add_argument('end',  required=True,
                            help='end cannot be blank!')
        parser.add_argument('realtime',  required=True,
                            help='end cannot be blank!')
        args = parser.parse_args()
        return getTrip(args['start'], args['end'], 'true' == args['realtime'].lower())


api.add_resource(Station, '/api/v1/station')
api.add_resource(UpdateData, '/api/v1/updateData')
api.add_resource(Trip, '/api/v1/trip')
api.add_resource(Home, '/api/')

if __name__ == "__main__":
    app.run(host="0.0.0.0")
