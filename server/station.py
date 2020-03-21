from bikeApi import getData
from newStore import insert, query, delete, formatInsert, stationQuery
import re
import json

OWL_URL = "http://www.owl-ontologies.com/unnamed.owl#"


def addData():
    delete()
    print("Data deleted.")
    normalizedData = getData()
    print("Data fetched.")
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
    for prop, value in station.items():
        propType, dest = switchType(prop)
        if dest == 'location':
            tripletList.append(createTriplet(locationRef, propType, value))
        else:
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


def FormatBikeStationResponse(stations):
    results = []
    with open('./mapping/bike_station.json') as f:
        mapping = json.load(f)
        for station in stations["results"]["bindings"]:
            stationDict = {}
            for param, var in mapping.items():
                stationDict[param] = convertRDFToValue(station[var])
            results.append(stationDict)
    return results


def getStation(stationType, city):
    if stationType == 'bikes':
        queryPayload = stationQuery(city)
        results = query(queryPayload)
        stations = FormatBikeStationResponse(results)
        return {
            "data": {
                "city": city,
                "stations": stations
            }
        }
    else:
        return {'hello': 'world'}
