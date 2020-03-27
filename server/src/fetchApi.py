import requests
import json
import xmltodict
import arrow
import urllib

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.3'
}

# Read mapping to convert API to json data
def readMapping(path):
    with open(path) as f:
        mapping = json.load(f)
        return mapping


# Fetch Api and convert result to json data
def fetchApi(url, dataType, pathToArray):
    data = None
    if(dataType == 'json'):
        response = requests.get(url)
        if(response.status_code == 200):
            data = response.json()
    else:
        # Read XML
        req = urllib.request.Request(url=url, headers=HEADERS)
        xml = urllib.request.urlopen(req)
        xmlData = xml.read()
        xml.close()

        # Convert XML to json
        xmlDict = xmltodict.parse(xmlData)
        jsonString = json.dumps(xmlDict)
        data = json.loads(jsonString)

    if(pathToArray != None):
        data = extractDataFromPath(data, pathToArray)
    return data


# Convert value to number
def tryConvertToNumber(data):
    if isinstance(data, str) and data.replace('.', '', 1).isdigit():
        if data.isdigit():
            data = int(data)
        else:
            data = float(f"{float(data):.4f}")
    elif isinstance(data, float):
        data = float(f"{data:.4f}")
    return data


# Go to the right path to extract the value expected
def extractDataFromPath(data, paths):
    if not paths or not data:
        return None
    for path in paths.split(';'):
        if path.isdigit():
            path = int(path)
        data = data[path]
    return tryConvertToNumber(data)


# Normalize station api response to a unique json format
def normalizeStation(data, mapping, normalizedData):
    for station in data:
        if(mapping['pathToData'] != None):
            station = extractDataFromPath(station, mapping['pathToData'])
        stationData = {}
        for param, pathToValue in mapping['params'].items():
            stationData[param] = extractDataFromPath(
                station, pathToValue)    
            # Transform string or int date to timestamp
            if param == "lastUpdate":
                if isinstance(stationData[param], int):
                    stationData[param] = int(stationData[param] / 1000)
                if isinstance(stationData[param], str):
                    stationData[param] = arrow.get(stationData[param]).timestamp
        stationData["city"] = mapping["city"]
        normalizedData.append(stationData)



# Normalize weather api response to a unique json format
def normalizeWeather(data, mapping, normalizedData):
    weather = extractDataFromPath(data, mapping['pathToData'])
    weatherData = {}
    for param, pathToValue in mapping['params'].items():
        weatherData[param] = extractDataFromPath(weather, pathToValue)
    weatherData["cityName"] = mapping["city"]
    normalizedData.append(weatherData)


# Get Api data for a city or all cities
def getApiData(mapping, dataType, city=None):
    mappings = readMapping(mapping)
    # Select the right mapping if whe have selected a city
    if city:
        cityFound = False
        index = 0
        while not cityFound and index < len(mappings):
            if mappings[index]['city'] == city:
                mappings = [mappings[index]]
                cityFound = True
            index += 1
    # Call all the Api URL listed
    normalizedData = []
    for mapping in mappings:
        for url in mapping['url']:
            data = fetchApi(url, mapping['dataType'], mapping['pathToArray'])
            if data:
                # Call the right data normalizer
                if dataType == 'bikes':
                    normalizeStation(data, mapping, normalizedData)
                elif dataType == 'weather':
                    normalizeWeather(data, mapping, normalizedData)
                else:
                    Exception("Unknown Api dataType")
    return normalizedData