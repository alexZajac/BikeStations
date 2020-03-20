from rdflib import Graph, Literal, URIRef, Namespace


class Store:
    def __init__(self, ontologieName):
        self.g = Graph()
        self.g.parse(ontologieName)
        self.url = "http://www.owl-ontologies.com/unnamed.owl#"
        self.ns = Namespace(self.url)

    def query(self, params, request):
        formatted_query = """SELECT DISTINCT """+params+"""
            WHERE { 
                """+request+"""
            }"""
        print(formatted_query)
        qres = self.g.query(formatted_query,
                            initNs={"ns": self.url}
                            )
        count = 0
        for row in qres:
            print("%s is" % row)
            count += 1
        print(f"Total resources: {count}.")

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
