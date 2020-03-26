import React, { useState, useEffect } from "react";
import "./MapContainer.css";
import ReactMapGL, {
  Marker,
  WebMercatorViewport,
  FlyToInterpolator
} from "react-map-gl";
import { MdDirectionsBike } from "react-icons/md";

import marker_begin from "../../assets/marker_begin.png";
import marker_dest from "../../assets/marker_dest.png";

import PolylineOverlay from "./PolylineOverlay";
import "./MapContainer.css";
import {
  defaultMapState,
  coordinates,
  resizeEffect,
  MAP_TRANSITION_DURATION,
  MAPBOX_TOKEN
} from "../../Constants";
import { hasNoLength, isNull } from "../../Utils";

const DEFAULT_ZOOM = 12;
const DEFAULT_PADDING = 100;
const OFFSET_LEFT = -50;
const OFFSET_TOP = -75;
const MAP_STYLE = "mapbox://styles/mapbox/outdoors-v11";
const ICON_SIZE = 26;
const ICON_COLOR = "#333";

const MapContainer = ({ stations, setFocus, focus, tripData }) => {
  const [mapState, setMapState] = useState(defaultMapState);
  const [viewportWidth, setViewportWidth] = useState(
    document.documentElement.clientWidth
  );
  useEffect(() => resizeEffect(setViewportWidth), []);

  useEffect(() => {
    if (!hasNoLength(stations)) {
      const { city } = stations[0];
      const { latitude, longitude } = coordinates[city];
      setMapState({
        ...mapState,
        viewport: {
          ...mapState.viewport,
          zoom: DEFAULT_ZOOM,
          latitude,
          longitude,
          transitionDuration: MAP_TRANSITION_DURATION,
          transitionInterpolator: new FlyToInterpolator()
        }
      });
    }
  }, [stations, coordinates]);

  useEffect(() => {
    if (!isNull(tripData) && !hasNoLength(tripData)) {
      const points = getPointsFromTrip(tripData);
      const { longitude, latitude, zoom } = new WebMercatorViewport(
        mapState.viewport
      ).fitBounds(points, {
        padding: DEFAULT_PADDING
      });
      setMapState({
        ...mapState,
        viewport: {
          ...mapState.viewport,
          zoom,
          latitude,
          longitude,
          transitionDuration: MAP_TRANSITION_DURATION,
          transitionInterpolator: new FlyToInterpolator()
        }
      });
    }
  }, [tripData]);

  const getPointsFromTrip = tripData =>
    !isNull(tripData) && !hasNoLength(tripData)
      ? tripData.map(s => [s.longitude, s.latitude])
      : null;

  const renderStations = () => {
    let renderStations = stations;
    if (!isNull(focus))
      renderStations = renderStations.filter(s => s._id === focus);
    if (!isNull(tripData)) renderStations = [];
    return renderStations.map(s => {
      const { _id, latitude, longitude } = s;
      return (
        <Marker
          key={_id}
          latitude={latitude}
          longitude={longitude}
          offsetLeft={OFFSET_LEFT}
          offsetTop={OFFSET_TOP}
        >
          <div onClick={() => setFocus(_id)} className="container-user-marker">
            <div className="custom-marker">
              <MdDirectionsBike size={ICON_SIZE} color={ICON_COLOR} />
            </div>
          </div>
        </Marker>
      );
    });
  };

  const renderTripPath = () => {
    const points = getPointsFromTrip(tripData);
    return (
      <>
        <PolylineOverlay points={points} />
        <Marker
          key={0}
          longitude={points[0][0]}
          latitude={points[0][1]}
          offsetLeft={OFFSET_LEFT}
          offsetTop={OFFSET_TOP}
        >
          <div className="container-user-marker">
            <img
              src={marker_begin}
              className="marker-station"
              alt="Marker begin"
            />
          </div>
        </Marker>
        <Marker
          key={1}
          longitude={points[1][0]}
          latitude={points[1][1]}
          offsetLeft={OFFSET_LEFT}
          offsetTop={OFFSET_TOP}
        >
          <div
            className="container-user-marker"
            style={{ backgroundColor: "transparent", border: "none" }}
          >
            <img
              src={marker_dest}
              className="marker-station"
              alt="Marker dest"
              style={{ animation: "markerAnim 3s ease-in-out infinite 0.6s" }}
            />
          </div>
        </Marker>
      </>
    );
  };

  const getMapWidth = () => (viewportWidth > 920 ? "60vw" : "100vw");

  return (
    <div className="map-container">
      <ReactMapGL
        className="mapboxgl-map"
        {...mapState.viewport}
        mapStyle={MAP_STYLE}
        width={getMapWidth()}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        onViewportChange={viewport => {
          setMapState({
            ...mapState,
            viewport: {
              ...mapState.viewport,
              zoom: viewport.zoom,
              latitude: viewport.latitude,
              longitude: viewport.longitude,
              transitionDuration: 0
            }
          });
        }}
      >
        {renderStations()}
        {!isNull(tripData) && !hasNoLength(tripData) && renderTripPath()}
      </ReactMapGL>
    </div>
  );
};

export default MapContainer;
