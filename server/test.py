from rdflib import Literal, URIRef, Namespace
from rdflib.namespace import RDF
from bikeApi import getData
from store import Store


ns = Namespace("http://www.owl-ontologies.com/unnamed.owl#")


def add_data(store, url):
    normalizedData = getData()
    for i, station in enumerate(normalizedData):
        add_station(store, url, station, i)


def switchType(url, paramType):
    if paramType == 'long':
        return (ns.long, 'location')
    elif paramType == 'lat':
        return (ns.lat, 'location')
    elif paramType == 'name':
        return (ns.name, 'station')
    elif paramType == 'address':
        return (ns.address, 'location')
    elif paramType == 'capacity':
        return (ns.capacity, 'station')
    elif paramType == 'freeSlot':
        return (ns.freeSlots, 'station')
    elif paramType == 'availableBikes':
        return (ns.availableBikes, 'station')
    elif paramType == 'city':
        return (ns.city, 'location')
    elif paramType == 'lastUpdate':
        return (ns.lastUpdate, 'station')
    else:
        Exception("Unknown paramType")


def add_station(store, url, station, index):
    stationRef = URIRef(f"{url}BikeStation_{index}")
    locationRef = URIRef(f"{url}Location_{index}")
    store.add(stationRef, RDF.type, ns.BikeStation)
    store.add(locationRef, RDF.type, ns.Location)
    store.add(stationRef, ns.location, locationRef)
    for prop, value in station.items():
        propType, dest = switchType(url, prop)
        if dest == 'location':
            store.add(locationRef, propType, Literal(value))
        else:
            store.add(stationRef, propType, Literal(value))


def mockAdd(store, url):
    stationRef = URIRef(f"{url}BikeStation_Mock")
    locationRef = URIRef(f"{url}Location_Mock")
    store.add(stationRef, RDF.type, ns.BikeStation)
    store.add(locationRef, RDF.type, ns.Location)
    store.add(stationRef, ns.location, locationRef)
    station = {
        'long': 4.872251966821727,
        'lat': 45.747813529665854,
        'name': 'Test de culé',
        'address': '62 Rue du sel',
        'capacity': 30,
        'freeSlot': 23,
        'availableBikes': 6,
        'lastUpdate': '2020-03-20 08:43:22',
        'city': 'Culsucré'
    }
    for prop, value in station.items():
        propType, dest = switchType(url, prop)
        if dest == 'location':
            store.add(locationRef, propType, Literal(value))
        else:
            store.add(stationRef, propType, Literal(value))


if __name__ == "__main__":
    url = "http://www.owl-ontologies.com/unnamed.owl#"
    store = Store("./server/ontologie/semanticsProject.owl")
    add_data(store, url)
    mockAdd(store, url)
    # store.printStore()
    store.query(
        "?x", '?x rdf:type ns:BikeStation .\n ?x ns:location ?l .\n ?l ns:city "Lyon" .'
    )
