import requests

MAPS_API_KEY = 'AIzaSyBRN9n-q-vcOp6f0mVttTDix4dnRh4_BXs'

def getCoordinates(location):
    url = 'https://maps.googleapis.com/maps/api/geocode/json'
    params = {'key': MAPS_API_KEY, 'address': location}
    response = requests.get(url, params=params)
    if response.status_code != 200:
        response.raise_for_status()
    results = response.json()['results']
    location = results[0]['geometry']['location']
    return (location['lat'], location['lng'])