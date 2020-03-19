from rdflib import Graph, Literal, URIRef, Namespace

class Store:
    def __init__(self, ontologieName):
        self.g = Graph()
        self.g.parse(ontologieName)
        self.url = "http://www.owl-ontologies.com/unnamed.owl#"
        self.ns = Namespace(self.url)

    def query(self, params, request):
        qres = self.g.query(
            """SELECT DISTINCT """+params+"""
            WHERE { 
                """+request+"""
            }""",
            initNs = { "ns": self.url }
        )

        for row in qres:
            print("%s is %s" % row)

    def add(self, subj, pred, obj):
        self.g.add((subj, pred, obj))
    
    def printStore(self):
        for subj, pred, obj in self.g:
            print(subj, pred, obj, sep="\n", end="\n\n\n")


    # def add(self,):
    #     station = URIRef(f"{self.url}BikeStation")
    #     name = Literal('test')
        
    #     self.g.add((station, self.ns.name , name) )
    #     print(self.g.serialize(format="turtle"))

    #     # for subj, pred, obj in self.g:
    #     #     print(subj, pred, obj, sep="\n", end="\n\n\n")

# if __name__ == "__main__":
#     store = Store("./server/ontologie/bikes.owl")
#     # store.query("?p ns:age ?b .") 
#     store.add()
#     store.query("?x ?y", "?x ns:name ?y .")