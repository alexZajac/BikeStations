import requests
import json

def readMapping():
    with open('./mapping/weather_api.json') as f:
        mapping = json.load(f)
        return mapping


def fetchApi(url, dataType, pathToArray):
    data = None
    if(dataType == 'json'):
        response = requests.get(url)
        if(response.status_code == 200):
            data = response.json()
    return data


def tryConvertToNumber(data):
    if isinstance(data, str) and data.replace('.', '', 1).isdigit():
        if data.isdigit():
            data = int(data)
        else:
            data = float(data)
    return data


def extractDataFromPath(data, paths):
    if not paths or not data:
        return None
    for path in paths.split(';'):
        if path.isdigit():
            path = int(path)
        data = data[path]
    return tryConvertToNumber(data)


def normalizeData(data, mapping, normalizedData):
    weather = extractDataFromPath(data, mapping['pathToData'])
    weatherData = {}
    for param, pathToValue in mapping['params'].items():
        weatherData[param] = extractDataFromPath(weather, pathToValue)
    weatherData["cityName"] = mapping["city"]
    normalizedData.append(weatherData)


def getWeatherData():
    mappings = readMapping()
    normalizedData = []
    for mapping in mappings:
        for url in mapping['url']:
            data = fetchApi(url, mapping['dataType'], mapping['pathToArray'])
            if data:
                normalizeData(data, mapping, normalizedData)
    return normalizedData

if __name__ == "__main__":
    res = getWeatherData()
