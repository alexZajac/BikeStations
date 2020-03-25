import React, { useState, useEffect } from "react";
import axios from "axios";
import { defaultOptions } from "./Constants";
import "./App.css";
import { MapContainer, SearchContainer, ModalLoading } from "./components";

const App = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(defaultOptions);
  const [focus, setFocus] = useState(null);
  const [cityData, setCityData] = useState(null);
  const [tripData, setTripData] = useState(null);
  const [refreshData, setRefreshData] = useState(false);

  useEffect(() => {
    const fetchStations = async () => {
      const {
        city: { value },
        realtimeOption: { value: realtime }
      } = filters;
      const isRealtime = realtime === "Realtime data";
      try {
        const url = `/v1/station?city=${value}&type=bikes&realtime=${isRealtime}`;
        const response = await axios(url);
        const { data: respData } = response;
        const { data } = respData;
        const { stations, city: cityData } = data;
        console.log(cityData);
        console.log(stations);
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

  useEffect(() => {
    const refreshDataAsync = async () => {
      try {
        const url = `/v1/updateData`;
        const _ = await axios(url);
        setRefreshData(false);
      } catch (e) {
        alert(e);
      }
    };
    if (refreshData) refreshDataAsync();
  }, [refreshData]);

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
        setRefreshData={setRefreshData}
      />
      <MapContainer
        stations={stations}
        setFocus={setFocus}
        focus={focus}
        tripData={tripData}
      />
      <ModalLoading refreshData={refreshData} />
    </div>
  );
};

export default App;
