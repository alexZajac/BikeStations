import requests

MAPS_API_KEY = 'AIzaSyBRN9n-q-vcOp6f0mVttTDix4dnRh4_BXs'

# Convert string to location
def getCoordinates(location):
    url = 'https://maps.googleapis.com/maps/api/geocode/json'
    params = {'key': MAPS_API_KEY, 'address': location}
    response = requests.get(url, params=params)
    # If not sucess raise error
    if response.status_code != 200:
        response.raise_for_status()
        return (None, None)
    results = response.json()['results']
    # return results if we find one
    if len(results):
        location = results[0]['geometry']['location']
        return (location['lat'], location['lng'])
    else:
        return (None, None)
