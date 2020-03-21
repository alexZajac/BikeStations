import requests

STORE_URL = "http://192.168.99.101:3030/bikestation"

HEADERS_QUERY = {'Content-type': 'application/sparql-query'}
HEADERS_UPDATE = {'Content-type': 'application/sparql-update'}


def formatQuery(params, request):
    return """
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX ns: <http://www.owl-ontologies.com/unnamed.owl#> 

        SELECT DISTINCT """+params+"""
        WHERE { 
            """+request+"""
        }
    """


def formatDelete():
    return """
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX ns: <http://www.owl-ontologies.com/unnamed.owl#> 

        DELETE
        {
            ?s ?p ?o
        }
        WHERE
        {
            ?s ?p ?o
        }
    """


def formatInsert(tripletList):
    request = "".join(tripletList)
    return """
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX ns: <http://www.owl-ontologies.com/unnamed.owl#> 

        INSERT DATA
        { 	
            """+request+"""
        }
    """


def stationQuery(city):
    params = '?s ?ca ?fr ?av ?last ?l ?city ?name ?addr ?lat ?long '
    request = f'''
        ?s rdf:type ns:BikeStation .
        ?s ns:capacity ?ca .
        ?s ns:freeSlots ?fr .
        ?s ns:availableBikes ?av .
        ?s ns:lastUpdate ?last .
        ?s ns:location ?l .
        ?l ns:city "{city}" .
        ?l ns:city ?city .
        ?l ns:name ?name .
        ?l ns:address ?addr .
        ?l ns:lat ?lat .
        ?l ns:long ?long .
    '''
    return formatQuery(params, request)


def query(payload):
    response = requests.post(STORE_URL, data=payload, headers=HEADERS_QUERY)
    if response.status_code != 200:
        response.raise_for_status()
    data = response.json()
    return data


def insert(payload):
    response = requests.post(STORE_URL, data=payload, headers=HEADERS_UPDATE)
    if response.status_code != 204:
        response.raise_for_status()


def delete():
    response = requests.post(
        STORE_URL, data=formatDelete(), headers=HEADERS_UPDATE)
    if response.status_code != 204:
        response.raise_for_status()


if __name__ == "__main__":
    pass
