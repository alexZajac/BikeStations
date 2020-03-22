from bikeApi import getData
from weatherApi import getWeatherData
from newStore import insert, query, delete, formatInsert, stationQuery, cityQuery
import re
from datetime import datetime
import json

OWL_URL = "http://www.owl-ontologies.com/unnamed.owl#"


def addData():
    delete()
    print("Data deleted.")
    normalizedData = getData()
    print("Data fetched.")
    addCitiesRefs()
    print("Cities added.")
    tripletList = []
    for i, station in enumerate(normalizedData):
        addStation(station, i, tripletList)
        if i % 3 == 0:
            insertPayload = formatInsert(tripletList)
            insert(insertPayload)
            tripletList = []
    insertPayload = formatInsert(tripletList)
    insert(insertPayload)
    print("All resources added.")


def addCitiesRefs():
    weatherData = getWeatherData()
    tripletList = []
    for cityWeather in weatherData:
        cityName, temperature, pollutionIndex = cityWeather[
            "cityName"], cityWeather["temperature"], cityWeather["pollutionIndex"]
        cityRef = f"<{OWL_URL}{cityName}>"
        tripletList.append(createTriplet(cityRef, "rdf:type", "ns:City"))
        tripletList.append(createTriplet(cityRef, "ns:cityName", cityName))
        tripletList.append(createTriplet(
            cityRef, "ns:temperature", temperature))
        tripletList.append(createTriplet(
            cityRef, "ns:pollutionIndex", pollutionIndex))
        insertPayload = formatInsert(tripletList)
        insert(insertPayload)
        tripletList = []


def createTriplet(subject, predicate, objectValue):
    if not objectValue:
        objectValue = "!None"
        objectValue = f'"{objectValue}"'
    elif isinstance(objectValue, str):
        if objectValue[:3] != 'ns:' and objectValue[:5] != '<http':
            objectValue = re.sub(r'[^\w]', ' ', objectValue)
            objectValue = f'"{objectValue}"'
    return f'{subject} {predicate} {objectValue} .'


def switchType(paramType):
    if paramType == 'long':
        return ("ns:long", 'location')
    elif paramType == 'lat':
        return ("ns:lat", 'location')
    elif paramType == 'name':
        return ("ns:name", 'location')
    elif paramType == 'address':
        return ("ns:address", 'location')
    elif paramType == 'capacity':
        return ("ns:capacity", 'station')
    elif paramType == 'freeSlot':
        return ("ns:freeSlots", 'station')
    elif paramType == 'availableBikes':
        return ("ns:availableBikes", 'station')
    elif paramType == 'city':
        return ("ns:city", 'location')
    elif paramType == 'lastUpdate':
        return ("ns:lastUpdate", 'station')
    else:
        Exception("Unknown paramType")


def addStation(station, index, tripletList):
    stationRef = f"<{OWL_URL}BikeStation_{index}>"
    locationRef = f"<{OWL_URL}Location_{index}>"
    tripletList.append(createTriplet(stationRef, "rdf:type", "ns:BikeStation"))
    tripletList.append(createTriplet(locationRef, "rdf:type", "ns:Location"))
    tripletList.append(createTriplet(stationRef, "ns:location", locationRef))
    tripletList.append(createTriplet(locationRef, "ns:city", locationRef))
    for prop, value in station.items():
        propType, dest = switchType(prop)
        if dest == 'location':
            if prop == "city":
                tripletList.append(createTriplet(
                    locationRef, propType, f"<{OWL_URL}{value}>"))
            else:
                tripletList.append(createTriplet(locationRef, propType, value))
        else:
            # convert epoch time from milliseconds
            if prop == "lastUpdate" and isinstance(value, int):
                value = datetime.fromtimestamp(
                    value / 1000.0).strftime('%Y-%m-%d %H:%M:%S')
            tripletList.append(createTriplet(stationRef, propType, value))


def convertRDFToValue(rdfVariable):
    typeValue, datatype, value = None, None, None
    if "type" in rdfVariable:
        typeValue = rdfVariable["type"]
    if "datatype" in rdfVariable:
        datatype = rdfVariable["datatype"]
    if "value" in rdfVariable:
        value = rdfVariable["value"]
    print(typeValue, datatype, value)
    if typeValue == 'uri':
        return value.split('#')[1]
    elif typeValue == 'literal':
        if datatype == "http://www.w3.org/2001/XMLSchema#integer":
            return int(value)
        elif datatype == "http://www.w3.org/2001/XMLSchema#decimal":
            return float(value)
        elif value == "!None":
            return None
        else:
            return value
    else:
        Exception(
            f"Unknown typeValue for datatype:{datatype} && datatype:{value}")


def formatBikeStationResponse(stations):
    results = []
    with open('./mapping/bike_station.json') as f:
        mapping = json.load(f)
        for station in stations["results"]["bindings"]:
            stationDict = {}
            for param, var in mapping.items():
                stationDict[param] = convertRDFToValue(station[var])
            results.append(stationDict)
    return results


def formatCityDataResponse(cities):
    results = []
    with open('./mapping/weather_station.json') as f:
        mapping = json.load(f)
        for city in cities["results"]["bindings"]:
            cityDict = {}
            for param, var in mapping.items():
                cityDict[param] = convertRDFToValue(city[var])
            results.append(cityDict)
    return results


def getStation(stationType, city):
    if stationType == 'bikes':
        queryPayload = stationQuery(city)
        results = query(queryPayload)
        stations = formatBikeStationResponse(results)
        queryPayload = cityQuery(city)
        results = query(queryPayload)
        cityData = formatCityDataResponse(results)
        return {
            "data": {
                "city": cityData[0],
                "stations": stations
            }
        }
    else:
        return {'hello': 'world'}
