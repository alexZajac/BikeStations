import React, { useState } from "react";
import "./MapContainer.css";
import ReactMapGL, { Marker } from "react-map-gl";

import marker_bike from "../../assets/marker_bike.png";

import "./MapContainer.css";
import { defaultMapState } from "../../Constants";

const MapContainer = ({ stations }) => {
  const [state, setState] = useState(defaultMapState);

  const renderStations = () =>
    stations.map(s => {
      const { _id, latitude, longitude } = s;
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
              src={marker_bike}
              className="marker-station"
              alt="Marker station"
            />
          </div>
        </Marker>
      );
    });

  return (
    <div className="map-container">
      <ReactMapGL
        className="mapboxgl-map"
        {...state.viewport}
        mapStyle="mapbox://styles/mapbox/outdoors-v11"
        mapboxApiAccessToken="pk.eyJ1IjoiYWxleHphamFjIiwiYSI6ImNrNnR2cTh1ZTAzODAzZXA3MTZrMG1vd2MifQ.b7r-Znl2mfjKgkeQDPF8tg"
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
        {renderStations()}
      </ReactMapGL>
    </div>
  );
};

export default MapContainer;
