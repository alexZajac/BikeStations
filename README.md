# Cmanticz : Web Semantics final project

## Table of content
 - Project Description and Requirements
 - Project Demo
 - Installation Guide
 - Used Technologies
    1. Fuseki as TripleStore
    2. Flask with Python as backend API
    3. React as Frontend client
 - Application architecture
   1. Data extraction
   2. Data normalisation (JSON Mapping)
   3. Triplestore
        - Ontology
        - Realtime store feeding
   4. Querying the store (SPARQL)
        - Stations
        - Trips
        - etc
   5. Frontend Client (React app) 

## Project requirements

**Make a Web application for finding available bicycles, using open data from the bicycle sharing systems of many cities.**

### Minimal requirements
· Setup a triplestore. The simplest is to use Apache Jena Fuseki, but you may also install a OpenLink's Virtuoso server (triplestore used by DBpedia in its backend) or Blazegraph (triplestore used by Wikidata) or Stardog (another commercial triplestore that has a free version). A list of triplestores is available on Wikipedia.

· Define or reuse a vocabulary for describing bicycle-sharing stations and their availability using Protégé.

· Convert static data about the bicycle stations into RDF, and load the resulting data to the triplestore. You can simply generate an RDF file that you load manually to the triplestore, or add the RDF programmatically using SPARQL Update queries.

· Make a website (or a GUI application) that will allow one to select a city (in a list or on a map) and get the availability of the bicycles, and bicycle stations. There resulting list should be available in HTML with RDFa. You may also make the data available in RDF (Turtle, RDF/XML, or JSON-LD) based on content negotiation.

· While the real time data may be generated on the fly, static data should be extracted from the triplestore using a SPARQL query.

### Additional requirements
· Provide other kinds of availabilities (make sure that you extend the vocabulary for this);

· Integrate other transportation data (find bike stations nearest to train station) or other geospatial data;

· Add information on the prices, street addresses, etc.;

· Store the history of availabilities, and provide statistics;

· Use weather or air quality data as well;

· Provide a trip planning functionality (go from Place 1 to Place 2 by taking the available bike closest to Place  and bringing it to the station with available space, closest to Place 2).

## Demo - How to use

**The application is available from this url : https://bikestations.netlify.com/**

Its is composed in 2 parts:
- The menu on the left to interact with the different features
- A map on the right to show the results and explore.

Interface screen :
![Site Image](https://github.com/alexZajac/BikeStations/blob/master/images/site.JPG?raw=true)


## How to install

You can test this project in local with **Docker** using the following steps :
1. First clone this repository
```
git clone https://github.com/alexZajac/BikeStations.git
```
2. Then **in the project folder** run the docker compose command
```
docker-compose up
```
The project will then be available on http://localhost url.

## Used Technologies
### 1. Fuseki as TripleStore
#### Description
Apache Jena Fuseki is a SPARQL server. It can run as a operating system service, as a Java web application (WAR file), and as a standalone server. It provides security (using Apache Shiro) and has a user interface for server monitoring and administration.
#### How we use it
We choose to use it as a standalone server in order to just query the server with our SPARQL query and get the response containign the SPARQL query response.

### 2. Flask with Python as backend API
#### Description
Flask is a lightweight WSGI web application framework. It is designed to make getting started quick and easy, with the ability to scale up to complex applications. It began as a simple wrapper around Werkzeug and Jinja and has become one of the most popular Python web application frameworks.
#### How we use it
We use Flask to create a server running a complete API. All the features of our final project is handled by this API that we can query from the frontend client.

### 3. React as Frontend client
#### Description
React is a JavaScript library for building user interfaces. It is maintained by Facebook and a community of individual developers and companies.
React can be used as a base in the development of single-page or mobile applications.React is only concerned with rendering data to the DOM.
#### How we use it
We use React for all the Frontend.
React only handles the user interface, interprets what the user want to do, calls our Python API for handling the uer demands, and displays the API response on the interface.

## Application architecture
### 1. Data extraction
The data exctration is Handled by our Python API.

Since the data are spread in different data sources with different syntaxes, we fetch multiples urls for each city.

When the data is collected, still remains the normalization proccess. Some data are in JSON, others in XML. Also the properties names, global structures, or detailed data, are not the same for every sources.

### 2. Data normalisation (JSON Mapping) 
In order to normalize all the data, in a first time we convert the XML data into JSON data.

At this point we only have JSON data, but not with the same structure.

**We choose not to use a mapping using JSON-LD**

In order to process the mapping, we created a ```mapping.json``` file.
For each different JSON structure we have from the different data sources, we map it to our normalized reference structure.

Exemple for data for Lyon :
```json
  {
    "city": "Lyon",
    "url": [
      "https://download.data.grandlyon.com/wfs/rdata?..."
    ],
    "pathToArray": "features",
    "pathToData": "properties",
    "dataType": "json",
    "params": {
      "longitude": "lng",
      "latitude": "lat",
      "name": "name",
      "address": "address",
      "capacity": "bike_stands",
      "freeSlot": "available_bike_stands",
      "availableBikes": "available_bikes",
      "lastUpdate": "last_update"
    }
  },
```

Applying this to all our JSON strutures gives us all the data normalized in a homogeneous structure.

We don't use here JSON-LD mapping, but our own mapping in JSON. We chose to do it this way to facilitate the realtime data implementation.

### 3. TripleStore
#### Ontology
We created an ontology with protégé about cycling, stations, etc.

It defines a vocabulary, types and properties we can use to query our feed and query our triplestore.

In order to use the ontology we exptorted it to an ```.owl``` file we can import.

#### Realtime store feeding

Based on the ontology and our normalized data, we create all the triplets that can define a station.

From the json format we create a series of triplets to define the stations, which define the station in RDF, and then we can import it in our Fuseki triplestore.

For realtime data in the triplestore, we just repeat these 3 steps in a loop-based process:
1. Data extraction
2. Data JSON normalization
3. JSON data conversion to RDF for adding it in the store

### 4. Querying the store (SPARQL)

Having a triplestore using realtime data and our own vocubulary based on our ontology, we can query any data we want gathering avery sources just by querying our triplet store in SPARQL.

The Python API receive request with json body containing the city the user specified.

From the city we can build our SPARQL query to send to our triplestore :

```
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX ns: <http://www.owl-ontologies.com/unnamed.owl#> 

SELECT DISTINCT ?s ?ca ?fr ?av ?last ?l ?city ?name ?addr ?lat ?long
WHERE { 
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
}
```
> In this query the {city} is replaced by the city the user specified.

With all the information we get from the SPARQL query response we build our API response to send it back to the frontend client.

API response format:
```json
{
    "data":{
        "city": "Lyon",
        "station": [
            {
                "_id" : "BikeStation_1",
                "city": "Lyon",
                "name": "Perrache Est",
                "address": "48 Cours Suchet",
                "latitude": 34.052234,
                "longitude": -118.243685,
                "capacity": 20,
                "freeSlot": 3,
                "availableBikes": 17,
                "lastUpdate": "2020-03-20 10:30:00"
            },
            ...
        ]
    }
}
```


### 5. FrontendClient

Our front end client in React is simply the User Interface.

This is where the user can select fonctionnalities. The demand will be send to the Python API server, that will return the response like explained above.

Then it displays the result in the map interface.