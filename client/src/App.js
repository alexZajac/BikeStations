import React, { useState, useEffect } from "react";
import axios from "axios";
import { defaultOptions } from "./Constants";
import "./App.css";
import { MapContainer, SearchContainer } from "./components";

const REACT_APP_API_URL = "https://jsonplaceholder.typicode.com/todos";

const App = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(defaultOptions);

  useEffect(() => {
    const fetchStations = async () => {
      const { city, type } = filters;
      try {
        const response = await axios(`${REACT_APP_API_URL}`);
        const { data } = response;
        const stations = data.map((s, i) => ({
          _id: "BikeStation_" + i,
          city: "Lyon",
          name: "Perrache Est",
          address: "48 Cours Suchet",
          latitude: 34.052234,
          longitude: -118.243685,
          capacity: 20,
          freeSlot: 3,
          availableBikes: 17,
          lastUpdate: "2020-03-20 10:30:00"
        }));
        // const { error, stations } = data;
        // if (error.length > 0) alert(error);
        setStations(stations);
      } catch (e) {
        alert(e);
      }
    };
    if (loading) fetchStations();
  }, [loading]);

  useEffect(() => {
    setLoading(true);
  }, [filters]);

  useEffect(() => {
    setLoading(false);
  }, [stations]);

  return (
    <div className="app">
      <SearchContainer
        stations={stations}
        filters={filters}
        setFilters={setFilters}
        loading={loading}
      />
      <MapContainer stations={stations} />
    </div>
  );
};

export default App;
