from rdflib import Graph, Literal, URIRef, Namespace


def stationQuery(city):
    return ('?s ?name ?ca ?fr ?av ?last ?l ?lat ?long ?addr ?city',
            f'''
                ?s rdf:type ns:BikeStation .
                ?s ns:name ?name .
                ?s ns:capacity ?ca .
                ?s ns:freeSlots ?fr .
                ?s ns:availableBikes ?av .
                ?s ns:lastUpdate ?last .
                ?s ns:location ?l .
                ?l ns:city "{city}" .
                ?l ns:lat ?lat .
                ?l ns:long ?long .
                ?l ns:address ?addr .
                ?l ns:city ?city .
            ''')


def to_int(v):
    try:
        res = int(v)
        return res
    except:
        return None


def to_float(v):
    try:
        res = float(v)
        return res
    except:
        return None


class Store:
    def __init__(self, ontologieName):
        self.g = Graph()
        self.g.parse(ontologieName)
        self.url = "http://www.owl-ontologies.com/unnamed.owl#"
        self.ns = Namespace(self.url)

    def formatQuery(self, params, request):
        return """SELECT """+params+"""
            WHERE { 
                """+request+"""
            }"""

    def query(self, params, request):
        formatted_query = self.formatQuery(params, request)
        print(formatted_query)
        qres = self.g.query(formatted_query,
                            initNs={"ns": self.url}
                            )
        count = 0
        res = []
        for row in qres:
            # print([r for r in row])
            res.append([r for r in row])
            count += 1
        print(f"Total resources: {count}.")
        return res

    def getStations(self, city):
        stationProjection, stationQry = stationQuery(city)
        formatted_query = self.formatQuery(stationProjection, stationQry)
        qres = self.g.query(formatted_query,
                            initNs={"ns": self.url}
                            )
        count, res = 0, []
        for row in qres:
            # print([r for r in row])
            s, name, ca, fr, av, last, l, lat, long, addr, city = row
            res.append({
                "_id": s,
                "city": city,
                "name": name,
                "address": addr,
                "latitude": to_float(lat),
                "longitude": to_float(long),
                "capacity": to_int(ca),
                "freeSlots": to_int(fr),
                "availableBikes": to_int(av),
                "lastUpdate": last
            })
            count += 1
        print(f"Total resources: {count}.")
        return res

    def add(self, subj, pred, obj):
        self.g.add((subj, pred, obj))

    def printStore(self):
        for subj, pred, obj in self.g:
            print(subj, pred, obj, sep="\n", end="\n\n\n")
