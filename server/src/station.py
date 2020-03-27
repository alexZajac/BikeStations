from src.fetchApi import getApiData
from src.store import insert, query, delete, formatInsert, stationQuery, cityQuery
import re
from datetime import datetime
import json
import requests

OWL_URL = "http://www.owl-ontologies.com/unnamed.owl#"
MAX_WORKERS = 8

# Remove old data and get the new one to set the triple store
def addDataInStore():
    delete()
    addCitiesInfos()
    addStations()


# Create tiplet for station data
def getStationsTriplets(index, station, tripletList):
    # Define rdf type object
    stationRef = f"<{OWL_URL}BikeStation_{index}>"
    locationRef = f"<{OWL_URL}Location_{index}>"
    
    # Create triplet and configure relationship
    tripletList.append(createTriplet(stationRef, "rdf:type", "ns:BikeStation"))
    tripletList.append(createTriplet(locationRef, "rdf:type", "ns:Location"))
    tripletList.append(createTriplet(stationRef, "ns:location", locationRef))

    # Set right data to the right rdf:type object
    for prop, value in station.items():
        propType, dest = switchType(prop)
        if dest == 'location':
            if prop == 'city':
                tripletList.append(createTriplet(locationRef, propType, f"<{OWL_URL}{value}>"))
            else:
                tripletList.append(createTriplet(locationRef, propType, value))
        else:
            tripletList.append(createTriplet(stationRef, propType, value))



# Add stations data to store
def addStations():
    # Get data from Api
    normalizedData = getApiData('./mapping/bike_api.json',"bikes")
    print("Stations fetched.")

    tripletList = []
    # Get triplet for each data
    for index, station in enumerate(normalizedData):
        getStationsTriplets(index, station, tripletList)

        if index%4 == 0:
            # Format and insert the query
            insertPayload = formatInsert(tripletList)
            insert(insertPayload)
            tripletList = []

    print("Stations imported.")


# Create tiplet for weather data
def getCitiesTriplets(cityWeather, tripletList):
    cityName, temperature, pollutionIndex = cityWeather["cityName"], cityWeather["temperature"], cityWeather["pollutionIndex"]

    # Define rdf type object
    cityRef = f"<{OWL_URL}{cityName}>"
    
    # Create triplet
    tripletList.append(createTriplet(cityRef, "rdf:type", "ns:City"))
    tripletList.append(createTriplet(cityRef, "ns:cityName", cityName))
    tripletList.append(createTriplet(cityRef, "ns:temperature", temperature))
    tripletList.append(createTriplet(cityRef, "ns:pollutionIndex", pollutionIndex))


# Add cites data to store
def addCitiesInfos():
    # Get data from Api
    weatherData = getApiData('./mapping/weather_api.json','weather')
    print("Cities Infos fetched.")

    # Get triplet for each data
    tripletList = []
    for cityWeather in weatherData:
        getCitiesTriplets(cityWeather, tripletList)

    # Format and insert the query
    insertPayload = formatInsert(tripletList)
    insert(insertPayload)

    print("Cities Infos imported.")



# Create triplet
def createTriplet(subject, predicate, objectValue):
    # Create none type
    if not objectValue:
        objectValue = "!None"
        objectValue = f'"{objectValue}"'

    # remove non alphanumerical char
    elif isinstance(objectValue, str):
        if objectValue[:3] != 'ns:' and objectValue[:5] != '<http':
            objectValue = re.sub(r'[^\w]', ' ', objectValue)
            objectValue = f'"{objectValue}"'

    return f'{subject} {predicate} {objectValue} .'



# Define object type
def switchType(paramType):
    if paramType == 'longitude':
        return ("ns:long", 'location')
    elif paramType == 'latitude':
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

# Convert rdf value to json value
def convertRDFToValue(rdfVariable):
    # Get rdf params
    typeValue, datatype, value = None, None, None
    if "type" in rdfVariable:
        typeValue = rdfVariable["type"]
    if "datatype" in rdfVariable:
        datatype = rdfVariable["datatype"]
    if "value" in rdfVariable:
        value = rdfVariable["value"]

    # Convert data
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
        Exception(f"Unknown typeValue for datatype:{datatype} && datatype:{value}")



# Format SPARQL station response to json using mapping
def formatBikeStationResponse(stations):
    results = []
    with open('./mapping/bike_mapping.json') as f:
        mapping = json.load(f)
        for station in stations["results"]["bindings"]:
            stationDict = {}
            for param, var in mapping.items():
                stationDict[param] = convertRDFToValue(station[var])
            results.append(stationDict)
    return results



# Format SPARQL city response to json using mapping
def formatCityDataResponse(cities):
    results = []
    with open('./mapping/weather_mapping.json') as f:
        mapping = json.load(f)
        for city in cities["results"]["bindings"]:
            cityDict = {}
            for param, var in mapping.items():
                cityDict[param] = convertRDFToValue(city[var])
            results.append(cityDict)
    return results


# Get bikes stations
def getBikeStation(city, realTime):
    # if realtime get data from API
    if realTime:
        stations = getApiData('./mapping/bike_api.json',"bikes",city)
        # Add city and id to station
        for i, station in enumerate(stations):
            station['_id'] = i
            station['city'] = city
        return stations
    # if not raltime get data from store
    else:
        #Query and format the result
        queryPayload = stationQuery(city)
        results = query(queryPayload)
        return formatBikeStationResponse(results)


# Get city data
def getCityData(city, realTime):
    # if realtime get data from API
    if realTime:
        # Add city name to json
        cityData = getApiData('./mapping/weather_api.json','weather',city)
        cityData[0]['cityName'] = city
        return cityData
    # if not raltime get data from store
    else:
        #Query and format the result
        queryPayload = cityQuery(city)
        results = query(queryPayload)
        return formatCityDataResponse(results)


# Get station and city data and format to json response
def getStation(stationType, city, realTime):
    if stationType == 'bikes':
        cityData = getCityData(city, realTime)
        stations = getBikeStation(city, realTime)
        return {
            "data": {
                "city": cityData[0],
                "stations": stations
            }
        }
    else:
        return { "data": None }
