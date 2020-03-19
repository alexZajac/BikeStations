from rdflib import Literal, URIRef, Namespace
from rdflib.namespace import RDF
from bikeApi import getData 
from store import Store 


ns = Namespace("http://www.owl-ontologies.com/unnamed.owl#")

def add_data(store, url):  
    normalizedData = getData()
    for i, station in enumerate(normalizedData):
        add_station(store, url, station, i)

def switchType(url,paramType):
    if paramType == 'long': return (ns.long,'location')
    elif paramType == 'lat': return (ns.lat,'location')
    elif paramType == 'name': return (ns.name,'station')
    elif paramType == 'address': return (ns.address,'location')
    elif paramType == 'capacity': return (ns.capacity,'station')
    elif paramType == 'freeSlot': return (ns.freeSlots,'station')
    elif paramType == 'availableBikes': return (ns.availableBikes,'station')
    elif paramType == 'city': return (ns.city,'location')
    elif paramType == 'lastUpdate': return (ns.lastUpdate,'station')
    else: Exception("Unkown paramType")
        
    

def add_station(store, url, station, index):
    stationRef = URIRef(f"{url}{index}")
    locationRef = URIRef(f"{url}Location")
    store.add(stationRef, RDF.type, ns.BikeStation)
    store.add(locationRef, RDF.type, ns.Location)
    for prop, value in station.items():
        propType, dest = switchType(url, prop)
        if dest == 'location': 
            store.add(locationRef, propType, Literal(value))
        else:
            store.add(stationRef, propType, Literal(value))

if __name__ == "__main__":
    url = "http://www.owl-ontologies.com/unnamed.owl#"
    store = Store("./server/ontologie/semanticsProject.owl")
    # add_data(store, url)
    # store.printStore()
    store.query("?x ?y","?x ns:availableBikes ?y .")
        