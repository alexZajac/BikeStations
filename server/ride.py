from geopy.distance import geodesic
from mapsApi import getCoordinates
from station import getBikeStation, getCityData
import json

def findCity(startCoordinates):
    with open('./mapping/city.json') as f:
        cities = json.load(f)
        nearestCity = None
        minDistance = float('inf')
        for city in cities:
            cityCoordiantes = (cities[city]["latitude"],cities[city]["longitude"])
            distance = geodesic(cityCoordiantes, startCoordinates).m
            if distance < minDistance:
                minDistance = distance
                nearestCity = city
        return nearestCity

def findNearestStation(coordinates,stations):
    nearestStation = None
    minDistance = float('inf')
    for station in stations:
        sationCoordiantes = (station["latitude"],station["longitude"])
        distance = geodesic(sationCoordiantes, coordinates).m
        if distance < minDistance:
            minDistance = distance
            nearestStation = station
    return nearestStation


def getRide(start,end):
    startCoordinates = getCoordinates(start)
    endCoordinates = getCoordinates(end)
    # startCoordinates = (48.8953928, 2.2775785)
    # endCoordinates = (48.8961305, 2.2359116)

    city = findCity(startCoordinates)

    cityData = getCityData(city)
    stations = getBikeStation(city)

    startStation = findNearestStation(startCoordinates,stations)
    endStation = findNearestStation(endCoordinates,stations)

    return {
        "data": {
            "city": cityData[0],
            "stations": [
                startStation,
                endStation
            ]
        }
    }