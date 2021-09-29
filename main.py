from flask import Flask
from flask_restful import Resource, Api, reqparse
import pandas as pd
import ast

class Users(Resource):

    def get(self):
        data = pd.read_csv('users.csv')
        data = data.to_dict()

        return {'data': data}, 200

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('userId', required=True)
        parser.add_argument('name', required=True)
        parser.add_argument('city', required=True)
        args = parser.parse_args()

        ndata = pd.DataFrame(
            {
                'userId' : args['userId'],
                'name' : args['name'],
                'city' : args['city'],
                'locations' : [[]]
            }
        )

        data = pd.read_csv('users.csv')
        if args['userId'] in list(data['userId']):
            return {'message' : f"'{args['userId']}' already exists."}, 401
        else:
            data = data.append(ndata, ignore_index=True)
            data.to_csv('users.csv', index=False)
            return {'data' : data.to_dict()}, 200

    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument('userId', required=True)
        parser.add_argument('location', required=True)
        args = parser.parse_args()

        data = pd.read_csv('users.csv')

        if args['userId'] not in list(data['userId']):
            return {'message' : f"'{args['userId']}' user not found."}, 401
        else:
            data['locations'] = data['locations'].apply(lambda x: ast.literal_eval(x))
            user_data = data[data['userId'] == args['userId']]
            user_data['location'] = user_data['locations'].values[0].append(args['location'])
            data.to_csv('users.csv', index=False)
            return {'data' : data.to_dict()}, 200

class Locations(Resource):

    def get(self):
        data = pd.read('locations.csv')
        data = data.to_dict()

        return {'data': data}, 200

app = Flask(__name__)
api = Api(app)

api.add_resource(Users, '/users')
api.add_resource(Locations, '/locations')

if __name__ == '__main__':
    app.run()
