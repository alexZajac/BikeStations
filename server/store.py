from rdflib import Graph, Literal, URIRef, Namespace


class Store:
    def __init__(self, ontologieName):
        self.g = Graph()
        self.g.parse(ontologieName)
        self.url = "http://www.owl-ontologies.com/unnamed.owl#"
        self.ns = Namespace(self.url)

    def query(self, params, request):
        formatted_query = """SELECT """+params+"""
            WHERE { 
                """+request+"""
            }"""
        print(formatted_query)
        qres = self.g.query(formatted_query,
                            initNs={"ns": self.url}
                            )
        count = 0
        for row in qres:
            print(row)
            # print("%s is %s" % row)
            count += 1
        print(f"Total resources: {count}.")

    def add(self, subj, pred, obj):
        self.g.add((subj, pred, obj))

    def printStore(self):
        for subj, pred, obj in self.g:
            print(subj, pred, obj, sep="\n", end="\n\n\n")

