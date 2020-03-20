from rdflib import Literal, URIRef, Namespace
from rdflib.namespace import RDF
from bikeApi import getData
from store import Store


def addData(store, url):
    normalizedData = getData()
    for i, station in enumerate(normalizedData):
        addStation(store, url, station, i)
    print("Done init")


def switchType(url, paramType):
    ns = Namespace(url)
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


def addStation(store, url, station, index):
    ns = Namespace(url)
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


def getStation(store, sationType, city):
    if sationType == 'bikes':
        # store.query(
        #     '?x ?ca ?fr ?av ?last', 
        #     f''' 
        #         ?x rdf:type ns:BikeStation .
        #         ?x ns:capacity ?ca .
        #         ?x ns:freeSlots ?fr .
        #         ?x ns:availableBikes ?av .
        #         ?x ns:lastUpdate ?last .
        #         ?x ns:location ?ci .
        #         ?ci ns:city "{city}" .
        #     ''')        
        store.query(
            '?x ?na ?long ?lat ?ad ?ca ?fr ?av ?ci ?last', 
            f''' 
                ?x rdf:type ns:BikeStation .
                ?x ns:capacity ?ca.
                ?x ns:freeSlots ?fr .
                ?x ns:availableBikes ?av .
                ?x ns:lastUpdate ?last .
                ?x ns:location ?ci .
                ?ci ns:city "{city}" .
                ?ci ns:name ?na .
                ?ci ns:long ?long .
                ?ci ns:lat ?lat .
                ?ci ns:address ?ad .
            ''')
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
