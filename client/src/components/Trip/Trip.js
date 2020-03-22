import React, { useState, useEffect } from "react";
import "./Trip.css";

import { selectStyles } from "../../Constants";

import SearchInput from "../SearchInput";

import { FaMapMarkerAlt, FaLocationArrow } from "react-icons/fa";

const Trip = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const renderStations = () => {
    return <div className="content-wrapper"></div>;
  };

  const renderInputs = () => (
    <div className="row-inputs-trip">
      <div className="column">
        <FaLocationArrow size={20} color="#00f7a8" />
        <p className="title-part-weather">.</p>
        <p className="title-part-weather">.</p>
        <p className="title-part-weather">.</p>
        <FaMapMarkerAlt size={20} color="red" style={{ marginTop: "10px" }} />
      </div>
      <div className="column">
        <SearchInput
          inputValue={from}
          setInputValue={setFrom}
          placeholder="Départ"
        />
        <SearchInput
          inputValue={to}
          setInputValue={setTo}
          placeholder="Destination"
        />
      </div>
    </div>
  );

  return (
    <div className="content-wrapper">
      {renderInputs()}
      {renderStations()}
    </div>
  );
};

export default Trip;
