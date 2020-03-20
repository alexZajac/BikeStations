from rdflib import Literal, URIRef, Namespace
from rdflib.namespace import RDF, XSD
from bikeApi import getData
from store import Store


def addData(store, url):
    normalizedData = getData()
    for i, station in enumerate(normalizedData):
        addStation(store, url, station, i)
    print("All resources added.")


def switchType(url, paramType):
    ns = Namespace(url)
    if paramType == 'long':
        return (ns.long, 'location', XSD.float)
    elif paramType == 'lat':
        return (ns.lat, 'location', XSD.float)
    elif paramType == 'name':
        return (ns.name, 'station', XSD.string)
    elif paramType == 'address':
        return (ns.address, 'location', XSD.string)
    elif paramType == 'capacity':
        return (ns.capacity, 'station', XSD.integer)
    elif paramType == 'freeSlot':
        return (ns.freeSlots, 'station', XSD.integer)
    elif paramType == 'availableBikes':
        return (ns.availableBikes, 'station', XSD.integer)
    elif paramType == 'city':
        return (ns.city, 'location', XSD.string)
    elif paramType == 'lastUpdate':
        return (ns.lastUpdate, 'station', XSD.integer)
    else:
        Exception("Unknown paramType")


def addStation(store, url, station, index):
    ns = Namespace(url)
    stationRef = URIRef(f"{url}BikeStation_{index}")
    locationRef = URIRef(f"{url}Location_{index}")
    store.add(stationRef, RDF.type, ns.BikeStation)
    store.add(locationRef, RDF.type, ns.Location)
    store.add(stationRef, ns.location, locationRef)
    for prop, value in station.items():
        propType, dest, datatype = switchType(url, prop)
        if dest == 'location':
            store.add(locationRef, propType, Literal(value, datatype=datatype))
        else:
            store.add(stationRef, propType, Literal(value, datatype=datatype))


def getStation(store, stationType, city):
    if stationType == 'bikes':
        stations = store.getStations(city)
        return {
            "data": {
                "city": city,
                "stations": stations
            }
        }
    else:
        return {'hello': 'world'}

# def mockAdd(store, url):
#     stationRef = URIRef(f"{url}BikeStation_Mock")
#     locationRef = URIRef(f"{url}Location_Mock")
#     store.add(stationRef, RDF.type, ns.BikeStation)
#     store.add(locationRef, RDF.type, ns.Location)
#     store.add(stationRef, ns.location, locationRef)
#     station = {
#         'long': 4.872251966821727,
#         'lat': 45.747813529665854,
#         'name': 'Test de culé',
#         'address': '62 Rue du sel',
#         'capacity': 30,
#         'freeSlot': 23,
#         'availableBikes': 6,
#         'lastUpdate': '2020-03-20 08:43:22',
#         'city': 'Culsucré'
#     }
#     for prop, value in station.items():
#         propType, dest = switchType(url, prop)
#         if dest == 'location':
#             store.add(locationRef, propType, Literal(value))
#         else:
#             store.add(stationRef, propType, Literal(value))


# if __name__ == "__main__":
#     url = "http://www.owl-ontologies.com/unnamed.owl#"
#     store = Store("./server/ontologie/semanticsProject.owl")
#     add_data(store, url)
#     mockAdd(store, url)
#     # store.printStore()
#     # store.query(
#     #     "?x", '?x rdf:type ns:BikeStation .\n ?x ns:location ?l .\n ?l ns:city "Lyon" .'
#     # )
