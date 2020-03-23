from bikeApi import getData
from weatherApi import getWeatherData
from store import insert, query, delete, formatInsert, stationQuery, cityQuery
import arrow
import re
from datetime import datetime
import json

OWL_URL = "http://www.owl-ontologies.com/unnamed.owl#"


def addDataInStore():
    delete()
    print("Data deleted.")
    addCitiesInfos()
    addStations()


def addStations():
    normalizedData = getData()
    print("Stations fetched.")
    tripletList = []
    for index, station in enumerate(normalizedData):
        stationRef = f"<{OWL_URL}BikeStation_{index}>"
        locationRef = f"<{OWL_URL}Location_{index}>"
        tripletList.append(createTriplet(stationRef, "rdf:type", "ns:BikeStation"))
        tripletList.append(createTriplet(locationRef, "rdf:type", "ns:Location"))
        tripletList.append(createTriplet(stationRef, "ns:location", locationRef))
        for prop, value in station.items():
            propType, dest = switchType(prop)
            if dest == 'location':
                if prop == 'city':
                    tripletList.append(createTriplet(locationRef, propType, f"<{OWL_URL}{value}>"))
                else:
                    tripletList.append(createTriplet(locationRef, propType, value))
            else:
                # convert epoch time from milliseconds
                if prop == "lastUpdate":
                    if isinstance(value, int):
                        value = int(value/1000)
                    if isinstance(value, str):
                        value =  arrow.get(value).timestamp
                tripletList.append(createTriplet(stationRef, propType, value))
        if True:
            insertPayload = formatInsert(tripletList)
            insert(insertPayload)
            tripletList = []
    print("Stations imported.")


def addCitiesInfos():
    weatherData = getWeatherData()
    print("Cities Infos fetched.")
    tripletList = []
    for cityWeather in weatherData:
        cityName, temperature, pollutionIndex = cityWeather[
            "cityName"], cityWeather["temperature"], cityWeather["pollutionIndex"]
        cityRef = f"<{OWL_URL}{cityName}>"
        tripletList.append(createTriplet(cityRef, "rdf:type", "ns:City"))
        tripletList.append(createTriplet(cityRef, "ns:cityName", cityName))
        tripletList.append(createTriplet(cityRef, "ns:temperature", temperature))
        tripletList.append(createTriplet(cityRef, "ns:pollutionIndex", pollutionIndex))
    insertPayload = formatInsert(tripletList)
    insert(insertPayload)
    print("Cities Infos imported.")


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


def convertRDFToValue(rdfVariable):
    typeValue, datatype, value = None, None, None
    if "type" in rdfVariable:
        typeValue = rdfVariable["type"]
    if "datatype" in rdfVariable:
        datatype = rdfVariable["datatype"]
    if "value" in rdfVariable:
        value = rdfVariable["value"]
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

def getBikeStation(city):
    queryPayload = stationQuery(city)
    results = query(queryPayload)
    return formatBikeStationResponse(results)

def getCityData(city):
    queryPayload = cityQuery(city)
    results = query(queryPayload)
    return formatCityDataResponse(results)


def getStation(stationType, city):
    if stationType == 'bikes':
        stations = getBikeStation(city)
        cityData = getCityData(city)
        return {
            "data": {
                "city": cityData[0],
                "stations": stations
            }
        }
    else:
        return {'hello': 'world'}
