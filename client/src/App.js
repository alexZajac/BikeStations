import React, { useState, useEffect } from "react";
import axios from "axios";
import { defaultOptions } from "./Constants";
import "./App.css";
import { MapContainer, SearchContainer } from "./components";

const App = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(defaultOptions);
  const [focus, setFocus] = useState(null);
  const [cityData, setCityData] = useState(null);
  const [tripData, setTripData] = useState(null);

  useEffect(() => {
    const fetchStations = async () => {
      const {
        city: { value }
      } = filters;
      try {
        const url = `/api/v1/station?city=${value}&type=bikes&realtime=True`;
        const response = await axios(url);
        const { data: respData } = response;
        const { data } = respData;
        const { stations, city } = data;
        // console.log(city);
        // console.log(stations);
        // const stations = [null, null, null].map((_, i) => ({
        //   _id: "BikeStation_" + i,
        //   city: "Paris",
        //   name: "Perrache Est",
        //   address: "48 Cours Suchet",
        //   latitude: 34.052234,
        //   longitude: -118.243685,
        //   capacity: 20,
        //   freeSlot: 3,
        //   availableBikes: 17,
        //   lastUpdate: 1584871619
        // }));
        // const cityData = {
        //   name: "Paris",
        //   temperature: 18.2,
        //   pollutionIndex: 24
        // };
        setFocus(null);
        setCityData(cityData);
        setStations(stations);
      } catch (e) {
        alert(e);
      }
    };
    if (loading) fetchStations();
  }, [loading]);

  useEffect(() => {
    setLoading(false);
  }, [stations]);

  useEffect(() => {
    setLoading(true);
  }, [filters]);

  return (
    <div className="app">
      <SearchContainer
        stations={stations}
        cityData={cityData}
        filters={filters}
        setFilters={setFilters}
        loading={loading}
        setFocus={setFocus}
        focus={focus}
        tripData={tripData}
        setTripData={setTripData}
      />
      <MapContainer
        stations={stations}
        setFocus={setFocus}
        focus={focus}
        tripData={tripData}
      />
    </div>
  );
};

export default App;
