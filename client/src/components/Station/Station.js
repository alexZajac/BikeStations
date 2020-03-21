import React from "react";
import "./Station.css";

import { MdDirectionsBike, MdUpdate, MdFlipToBack } from "react-icons/md";

import station_img from "../../assets/marker_bike.png";
import Skeleton from "react-loading-skeleton";

// {
//   "_id" : "BikeStation_1",
//   "city": "Lyon",
//   "name": "Perrache Est",
//   "address": "48 Cours Suchet",
//   "latitude": 34.052234,
//   "longitude": -118.243685,
//   "capacity": 20,
//   "freeSlot": 3,
//   "availableBikes": 17,
//   "lastUpdate": "2020-03-20 10:30:00"
// }

const Station = ({
  city,
  name,
  address,
  capacity,
  freeSlot,
  availableBikes,
  lastUpdate
}) => {
  const getLocation = () => `${address === null ? "" : address + ","} ${city}`;
  const getSlots = () => `${freeSlot} slots remaining on ${capacity}`;
  const getAvailabilities = () =>
    `${
      availableBikes === null
        ? "No data on availability"
        : availableBikes + " bikes available for rent"
    }`;
  const getLastUpdate = () =>
    `${lastUpdate === null ? "Not available" : lastUpdate + " (last update)"}`;

  const renderContent = () => (
    <div className="content-container">
      <div className="main-infos">
        <p property="ns:name" className="primary-info">
          {name === null ? "" : name}
        </p>
        <p className="secondary-info">{getLocation()}</p>
      </div>
      <div className="icons-infos">
        <div className="row-infos">
          <MdFlipToBack
            size={20}
            color="#999"
            style={{ marginRight: "10px" }}
          />
          <p className="secondary-info">{getSlots()}</p>
        </div>
        <div className="row-infos">
          <MdDirectionsBike
            size={20}
            color="#999"
            style={{ marginRight: "10px" }}
          />
          <p className="secondary-info">{getAvailabilities()}</p>
        </div>
        <div className="row-infos">
          <MdUpdate size={20} color="#999" style={{ marginRight: "10px" }} />
          <p className="secondary-info">{getLastUpdate()}</p>
        </div>
      </div>
    </div>
  );

  const renderPicture = () => (
    <div className="picture-container">
      <img src={station_img} alt="station" className="station-picture" />
    </div>
  );

  return (
    <div className="station-container" typeof="ns:BikeStation">
      {renderPicture()}
      {renderContent()}
    </div>
  );
};

const SkeletonStation = () => {
  const renderPicture = () => (
    <div className="picture-container">
      <Skeleton width="30vh" height="25vh" />
    </div>
  );

  const renderContent = () => (
    <div className="content-container">
      <div className="main-infos">
        <div className="row-infos">
          <Skeleton width="10vw" height="3vh" />
        </div>
        <div className="row-infos">
          <Skeleton width="15vw" height="3vh" />
        </div>
      </div>
      <div className="icons-infos">
        <div className="row-infos">
          <Skeleton width="4vw" height="2vh" />
        </div>
        <div className="row-infos">
          <Skeleton width="12vw" height="2vh" />
        </div>
        <div className="row-infos">
          <Skeleton width="10vw" height="2vh" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="station-container">
      {renderPicture()}
      {renderContent()}
    </div>
  );
};

export { Station, SkeletonStation };
