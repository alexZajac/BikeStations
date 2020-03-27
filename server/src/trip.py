from geopy.distance import geodesic
from app.mapsApi import getCoordinates
from app.station import getBikeStation, getCityData
import json

#Find city from start coordinates
def findCity(startCoordinates):
    with open('./mapping/city.json') as f:
        cities = json.load(f)
        nearestCity = None
        minDistance = float('inf')
        
        #Find search the nearest city from the starting point
        for city in cities:
            cityCoordiantes = (cities[city]["latitude"],cities[city]["longitude"])
            distance = geodesic(cityCoordiantes, startCoordinates).m

            #Check if it's the nearest
            if distance < minDistance:
                minDistance = distance
                nearestCity = city

        return nearestCity


#Find the nearest available station for the user location
def findNearestStation(coordinates, stations, paramLook):
    nearestStation = None
    minDistance = float('inf')

    #Search the nearest station
    for station in stations:
        stationCoordiantes = (station["latitude"], station["longitude"])

        #Check if station is not empty or have free space
        mustNotBeZero = station[paramLook]

        #if the check is ok, check if it's the nearest
        if mustNotBeZero:
            distance = geodesic(stationCoordiantes, coordinates).m
            if distance < minDistance:
                minDistance = distance
                nearestStation = station

    return nearestStation

# get trip data info
def getTrip(start, end, realTime):
    #Convert street string to coordinate
    startCoordinates = getCoordinates(start)
    endCoordinates = getCoordinates(end)
    
    #Return empty if don't find coordinate
    if startCoordinates[0] is None or endCoordinates[0] is None:
        return {
            "data": {
                "city": None,
                "stations": []
            }
        }
    else:
        #Find city
        city = findCity(startCoordinates)

        #Get data
        cityData = getCityData(city, realTime)
        stations = getBikeStation(city, realTime)

        #Find nearest available station from coordinate
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
