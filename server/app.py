from flask import Flask
from flask_restful import Resource, Api, reqparse
from station import addDataInStore, getStation

app = Flask(__name__)
api = Api(app)


class Home(Resource):
    def get(self):
        return {
            "updated": True
        }
    
class AddData(Resource):
    def get(self):
        addDataInStore()
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
        return getStation(args['type'], args['city'])


api.add_resource(Station, '/v1/station')
api.add_resource(AddData, '/v1/addData')
api.add_resource(Home, '/')

if __name__ == "__main__":
    app.run()
