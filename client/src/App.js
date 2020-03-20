import React, { useState, useEffect } from "react";
import axios from "axios";
import { defaultOptions } from "./Constants";
import "./App.css";
import { MapContainer, SearchContainer } from "./components";

const { REACT_APP_API_URL } = process.env;

const App = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(defaultOptions);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.post(
          `${REACT_APP_API_URL}/api/restaurants`,
          {
            ...filters,
            userLocation
          }
        );
        const { data } = response;
        const { error, restaurants } = data;
        if (error.length > 0) alert(error);
        setRestaurants(restaurants);
      } catch (e) {
        alert(e);
      }
    };
    if (loading) fetchRestaurants();
  }, [loading]);

  useEffect(() => {
    setLoading(true);
  }, [filters]);

  useEffect(() => {
    setLoading(false);
  }, [restaurants]);

  useEffect(() => {
    localizeUser();
  }, []);

  const localizeUser = () => {
    navigator.geolocation.getCurrentPosition(position => {
      const userLocation = {
        lat: position.coords.latitude,
        long: position.coords.longitude
      };
      setUserLocation(userLocation);
    });
  };

  const setRestaurantsFocus = restoId => {
    setRestaurants(restaurants.filter(r => r._id === restoId));
  };

  return (
    <div className="app">
      <SearchContainer
        restaurants={restaurants}
        filters={filters}
        setFilters={setFilters}
        loading={loading}
      />
      <MapContainer
        userLocation={userLocation}
        restaurants={restaurants}
        setRestaurantsFocus={setRestaurantsFocus}
      />
    </div>
  );
};

export default App;
