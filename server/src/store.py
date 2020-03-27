import requests

STORE_URL = "http://db:3030/bikestation"

HEADERS_QUERY = {'Content-type': 'application/sparql-query'}
HEADERS_UPDATE = {'Content-type': 'application/sparql-update'}

# Create format for SPARQL query
def formatQuery(params, request):
    return """
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX ns: <http://www.owl-ontologies.com/unnamed.owl#> 

        SELECT DISTINCT """+params+"""
        WHERE { 
            """+request+"""
        }
    """

# Create format for SPARQL delete
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

# Create format for SPARQL insert
def formatInsert(values):
    request = " \n".join(values)
    return """
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX ns: <http://www.owl-ontologies.com/unnamed.owl#> 

        INSERT DATA
        { 	
            """+request+"""
        }
    """

# Configure request to query station
def stationQuery(city):
    params = '?s ?ca ?fr ?av ?last ?l ?city ?name ?addr ?lat ?long '
    request = f'''
        ?s rdf:type ns:BikeStation .
        ?s ns:capacity ?ca .
        ?s ns:freeSlots ?fr .
        ?s ns:availableBikes ?av .
        ?s ns:lastUpdate ?last .
        ?s ns:location ?l .
        ?l ns:name ?name .
        ?l ns:address ?addr .
        ?l ns:lat ?lat .
        ?l ns:long ?long .
        ?l ns:city ?c .
        ?c ns:cityName "{city}" .
        ?c ns:cityName ?city .
    '''
    return formatQuery(params, request)


# Configure request to query city
def cityQuery(city):
    params = '?name ?temperature ?pollutionIndex '
    request = f'''
        ?city rdf:type ns:City .
        ?city ns:cityName "{city}" .
        ?city ns:cityName ?name .
        ?city ns:temperature ?temperature .
        ?city ns:pollutionIndex ?pollutionIndex .
    '''
    return formatQuery(params, request)


# Query data from fuseki by http request
def query(payload):
    response = requests.post(STORE_URL, data=payload, headers=HEADERS_QUERY)
    if response.status_code != 200:
        response.raise_for_status()
    data = response.json()
    return data


# Insert data into fuseki by http request
def insert(payload):
    response = requests.post(STORE_URL, data=payload, headers=HEADERS_UPDATE)
    if response.status_code != 204:
        response.raise_for_status()


# Delete data into fuseki by http request
def delete():
    response = requests.post(
        STORE_URL, data=formatDelete(), headers=HEADERS_UPDATE)
    if response.status_code != 204:
        response.raise_for_status()
    print("Data deleted.")