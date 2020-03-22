import React, { useState, useEffect } from "react";
import axios from "axios";
import { defaultOptions } from "./Constants";
import "./App.css";
import { MapContainer, SearchContainer } from "./components";

const App = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(defaultOptions);

  useEffect(() => {
    const fetchStations = async () => {
      const {
        city: { value }
      } = filters;
      try {
        const url = `/v1/station?city=${value}&type=bikes`;
        const response = await axios(url);
        const { data: respData } = response;
        const { data } = respData;
        const { stations, city } = data;
        console.log(city);
        console.log(stations);
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
        filters={filters}
        setFilters={setFilters}
        loading={loading}
      />
      <MapContainer stations={stations} />
    </div>
  );
};

export default App;
