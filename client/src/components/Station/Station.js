import React, { memo } from "react";
import "./Station.css";

import { MdDirectionsBike, MdUpdate, MdFlipToBack } from "react-icons/md";

import station_img from "../../assets/marker_bike.png";
import { isNull, isUndefined } from "../../Utils";

const ICON_SIZE = 20;
const ICON_COLOR = "#999";

const Station = ({
  city,
  name,
  address,
  capacity,
  freeSlot,
  availableBikes,
  lastUpdate,
  customImage
}) => {
  const getLocation = () => (
    <span property="ns:address">
      {isNull(address) ? "" : address + ", "}
      <span property="ns:cityName">{city}</span>
    </span>
  );
  const getSlots = () => (
    <span property="ns:freeSlots">
      {freeSlot} slots remaining on {' '}
      <span property="ns:capacity">{capacity}</span>
    </span>
  );
  const getAvailabilities = () => (
    <span property="ns:availableBikes">
      {isNull(availableBikes)
        ? "No data on availability"
        : availableBikes + " bikes available for rent"}
    </span>
  );
  const getLastUpdate = () => (
    <span property="ns:lastUpdate">
      {isNull(lastUpdate) ? "Not available" : convertToTime(lastUpdate * 1000)}
    </span>
  );

  const convertToTime = timestamp => {
    const pad = n => (n < 10 ? `0${n}` : n);
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${pad(day)}/${pad(month)}/${year} at ${pad(hours)}:${pad(
      minutes
    )}:${pad(seconds)}`;
  };

  const renderContent = () => (
    <div className="content-container">
      <div className="main-infos">
        <p property="ns:name" className="primary-info">
          {isNull(name) ? "" : name}
        </p>
        <p typeof="ns:Location" className="secondary-info">
          {getLocation()}
        </p>
      </div>
      <div className="icons-infos">
        <div className="row-infos">
          <MdFlipToBack
            size={ICON_SIZE}
            color={ICON_COLOR}
            style={{ marginRight: "10px" }}
          />
          <p className="secondary-info">{getSlots()}</p>
        </div>
        <div className="row-infos">
          <MdDirectionsBike
            size={ICON_SIZE}
            color={ICON_COLOR}
            style={{ marginRight: "10px" }}
          />
          <p className="secondary-info">{getAvailabilities()}</p>
        </div>
        <div className="row-infos">
          <MdUpdate
            size={ICON_SIZE}
            color={ICON_COLOR}
            style={{ marginRight: "10px" }}
          />
          <p className="secondary-info">{getLastUpdate()}</p>
        </div>
      </div>
    </div>
  );

  const renderPicture = () => (
    <div className="picture-container">
      <img
        property="foaf:img"
        src={!isUndefined(customImage) ? customImage : station_img}
        alt="station"
        className="station-picture"
      />
    </div>
  );

  return (
    <div className="station-container" typeof="ns:BikeStation">
      {renderPicture()}
      {renderContent()}
    </div>
  );
};

export default memo(Station);
