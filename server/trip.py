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
            cityCoordiantes = (cities[city]["latitude"],
                               cities[city]["longitude"])
            distance = geodesic(cityCoordiantes, startCoordinates).m
            if distance < minDistance:
                minDistance = distance
                nearestCity = city
        return nearestCity


def findNearestStation(coordinates, stations, paramLook):
    nearestStation = None
    minDistance = float('inf')
    for station in stations:
        stationCoordiantes = (station["latitude"], station["longitude"])
        mustNotBeZero = station[paramLook]
        if mustNotBeZero:
            distance = geodesic(stationCoordiantes, coordinates).m
            if distance < minDistance:
                minDistance = distance
                nearestStation = station
    return nearestStation


def getTrip(start, end, realTime):
    startCoordinates = getCoordinates(start)
    endCoordinates = getCoordinates(end)
    # startCoordinates = (48.8953928, 2.2775785)
    # endCoordinates = (48.8961305, 2.2359116)

    city = findCity(startCoordinates)

    cityData = getCityData(city,realTime)
    stations = getBikeStation(city,realTime)
    print(cityData)
    print(stations)
    startStation = findNearestStation(startCoordinates, stations, "availableBikes")
    endStation = findNearestStation(endCoordinates, stations, "freeSlot")

    return {
        "data": {
            "city": cityData[0],
            "stations": [
                startStation,
                endStation
            ]
        }
    }
