import React, { useState, useEffect } from "react";
import "./MapContainer.css";
import ReactMapGL, { Marker } from "react-map-gl";
import one_marker from "../../assets/1_marker.png";
import two_marker from "../../assets/2_marker.png";
import three_marker from "../../assets/3_marker.png";
import bib_marker from "../../assets/bib_marker.png";
import "./MapContainer.css";
import { defaultMapState } from "../../Constants";

const MapContainer = ({ userLocation, restaurants, setRestaurantsFocus }) => {
  const [state, setState] = useState(defaultMapState);

  useEffect(() => {
    if (userLocation !== null) setViewportUser();
  }, [userLocation]);

  const setViewportUser = () => {
    const viewport = {
      height: "100vh",
      width: "100%",
      latitude: userLocation.lat,
      longitude: userLocation.long,
      zoom: 13
    };
    setState({ ...state, viewport });
  };

  const renderUserLocation = () => {
    if (userLocation) {
      return (
        <Marker
          latitude={userLocation.lat}
          longitude={userLocation.long}
          offsetLeft={-50}
          offsetTop={-50}
        >
          <div className="container-user-marker">
            <div className="pulsating-marker" />
            <div className="fixed-marker-outline" />
            <div className="fixed-marker" />
          </div>
        </Marker>
      );
    }
    return null;
  };

  const renderRestaurants = () =>
    restaurants.map(r => {
      const longitude = r.location.coordinates[0];
      const latitude = r.location.coordinates[1];
      const {
        _id,
        distinction: { type }
      } = r;
      if (longitude === 0 && latitude === 0) return null;
      return (
        <Marker
          key={_id}
          latitude={latitude}
          longitude={longitude}
          offsetLeft={-50}
          offsetTop={-75}
        >
          <div className="container-user-marker">
            <img
              src={getMarker(type)}
              className="marker-restaurant"
              alt="Marker restaurant"
              onClick={() => setRestaurantsFocus(_id)}
            />
          </div>
        </Marker>
      );
    });

  const getMarker = distinction => {
    if (distinction === "BIB_GOURMAND") return bib_marker;
    if (distinction === "ONE_STAR") return one_marker;
    if (distinction === "TWO_STARS") return two_marker;
    if (distinction === "THREE_STARS") return three_marker;
  };

  return (
    <div className="map-container">
      <ReactMapGL
        className="mapboxgl-map"
        {...state.viewport}
        mapStyle="mapbox://styles/mapbox/outdoors-v11"
        onViewportChange={viewport => {
          setState({
            ...state,
            viewport: {
              ...state.viewport,
              zoom: viewport.zoom,
              latitude: viewport.latitude,
              longitude: viewport.longitude
            }
          });
        }}
      >
        {renderUserLocation()}
        {renderRestaurants()}
      </ReactMapGL>
    </div>
  );
};

export default MapContainer;
