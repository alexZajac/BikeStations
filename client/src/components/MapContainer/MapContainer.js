import React, { useState, useEffect } from "react";
import "./MapContainer.css";
import ReactMapGL, {
  Marker,
  CanvasOverlay,
  WebMercatorViewport,
  FlyToInterpolator
} from "react-map-gl";

import marker_begin from "../../assets/marker_begin.png";
import marker_dest from "../../assets/marker_dest.png";
import marker_bike from "../../assets/marker_bike.png";

import "./MapContainer.css";
import {
  defaultMapState,
  coordinates,
  MAP_TRANSITION_DURATION
} from "../../Constants";

const PolylineOverlay = props => {
  const _redraw = ({ width, height, ctx, isDragging, project }) => {
    const {
      points,
      color = "black",
      lineWidth = 4,
      renderWhileDragging = true
    } = props;
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";

    if ((renderWhileDragging || !isDragging) && points) {
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = color;
      ctx.beginPath();
      points.forEach(point => {
        const pixel = project([point[0], point[1]]);
        ctx.lineTo(pixel[0], pixel[1]);
      });
      ctx.stroke();
    }
  };
  return <CanvasOverlay redraw={_redraw} />;
};

const MapContainer = ({ stations, setFocus, focus, tripData }) => {
  const [state, setState] = useState(defaultMapState);
  const [viewportWidth, setViewportWidth] = useState(
    document.documentElement.clientWidth
  );

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(document.documentElement.clientWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (stations.length > 0) {
      const { city } = stations[0];
      const { latitude, longitude } = coordinates[city];
      setState({
        ...state,
        viewport: {
          ...state.viewport,
          zoom: 12,
          latitude,
          longitude,
          transitionDuration: MAP_TRANSITION_DURATION,
          transitionInterpolator: new FlyToInterpolator()
        }
      });
    }
  }, [stations, coordinates]);

  useEffect(() => {
    if (tripData !== null && tripData.length > 0) {
      const points = getPointsFromTrip(tripData);
      const { longitude, latitude, zoom } = new WebMercatorViewport(
        state.viewport
      ).fitBounds(points, {
        padding: 100
      });
      setState({
        ...state,
        viewport: {
          ...state.viewport,
          zoom,
          latitude,
          longitude,
          transitionDuration: MAP_TRANSITION_DURATION,
          transitionInterpolator: new FlyToInterpolator()
        }
      });
    }
  }, [tripData]);

  const getPointsFromTrip = tripData => {
    if (tripData !== null && tripData.length > 0) {
      return tripData.map(s => [s.longitude, s.latitude]);
    }
    return null;
  };

  const points = getPointsFromTrip(tripData);

  const renderStations = () => {
    let renderStations = stations;
    if (focus !== null)
      renderStations = renderStations.filter(s => s._id === focus);
    if (tripData !== null) {
      renderStations = [];
    }
    return renderStations.map(s => {
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
              onClick={() => setFocus(_id)}
            />
          </div>
        </Marker>
      );
    });
  };

  const renderTripPath = () => (
    <>
      <PolylineOverlay points={points} />
      <Marker
        key={0}
        longitude={points[0][0]}
        latitude={points[0][1]}
        offsetLeft={-50}
        offsetTop={-75}
      >
        <div className="container-user-marker">
          <img
            src={marker_begin}
            className="marker-station"
            alt="Marker begin"
            style={{ animation: "markerAnim 3s ease-in-out infinite" }}
          />
        </div>
      </Marker>
      <Marker
        key={1}
        longitude={points[1][0]}
        latitude={points[1][1]}
        offsetLeft={-50}
        offsetTop={-75}
      >
        <div className="container-user-marker">
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

  const getMapWidth = () => (viewportWidth > 920 ? "60vw" : "100vw");

  return (
    <div className="map-container">
      <ReactMapGL
        className="mapboxgl-map"
        {...state.viewport}
        mapStyle="mapbox://styles/mapbox/outdoors-v11"
        width={getMapWidth()}
        mapboxApiAccessToken="pk.eyJ1IjoiYWxleHphamFjIiwiYSI6ImNrNnR2cTh1ZTAzODAzZXA3MTZrMG1vd2MifQ.b7r-Znl2mfjKgkeQDPF8tg"
        onViewportChange={viewport => {
          setState({
            ...state,
            viewport: {
              ...state.viewport,
              zoom: viewport.zoom,
              latitude: viewport.latitude,
              longitude: viewport.longitude,
              transitionDuration: 0
            }
          });
        }}
      >
        {renderStations()}
        {tripData !== null && tripData.length > 0 && renderTripPath()}
      </ReactMapGL>
    </div>
  );
};

export default MapContainer;
