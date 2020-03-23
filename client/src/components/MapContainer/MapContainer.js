import React, { useState, useEffect } from "react";
import "./MapContainer.css";
import ReactMapGL, { Marker, CanvasOverlay } from "react-map-gl";

import marker_bike from "../../assets/marker_bike.png";

import "./MapContainer.css";
import { defaultMapState, coordinates } from "../../Constants";

const PolylineOverlay = props => {
  const _redraw = ({ width, height, ctx, isDragging, project, unproject }) => {
    const {
      points,
      color = "#00f7a8",
      lineWidth = 2,
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

const MapContainer = ({ stations, setStationFocus, stationFocus }) => {
  const [state, setState] = useState(defaultMapState);

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
          longitude
        }
      });
    }
  }, [stations, coordinates]);

  const renderStations = () => {
    let renderStations = stations;
    if (stationFocus !== null)
      renderStations = renderStations.filter(s => s._id === stationFocus);
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
              onClick={() => setStationFocus(_id)}
            />
          </div>
        </Marker>
      );
    });
  };

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
        {/* {renderStations()} */}
        <PolylineOverlay
          points={[
            [2.266552, 48.906463],
            [2.238354, 48.894077]
          ]}
        />
      </ReactMapGL>
    </div>
  );
};

export default MapContainer;
