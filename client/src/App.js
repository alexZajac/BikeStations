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
      const { city } = filters;
      try {
        const url = `/v1/station?city=${city}&type=bikes`;
        console.log(url);
        const response = await axios({
          url,
          method: "GET",
          timeout: 1000 * 60 * 10
        });
        const { data: respData } = response;
        const { data } = respData;
        const { stations } = data;
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
