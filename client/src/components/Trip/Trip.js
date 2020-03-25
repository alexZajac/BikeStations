import React, { useState, useEffect } from "react";
import "./Trip.css";

import axios from "axios";

import { GoPrimitiveDot } from "react-icons/go";

import marker_begin from "../../assets/marker_begin.png";
import marker_dest from "../../assets/marker_dest.png";

import SearchInput from "../SearchInput";
import { Station, SkeletonStation } from "../Station";

import { FaMapMarkerAlt, FaLocationArrow } from "react-icons/fa";

const Trip = ({ tripData, setTripData, filters }) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tripData !== null) setLoading(false);
  }, [tripData]);

  useEffect(() => {
    const fetchTrip = async () => {
      const {
        realtimeOption: { value: realtime }
      } = filters;
      const isRealtime = realtime === "Realtime data";
      const url = `/api/v1/trip?start=${encodeURI(from)}&end=${encodeURI(
        to
      )}&realtime=${isRealtime}`;
      const response = await axios(url);
      const { data: respData } = response;
      console.log(respData);
      const {
        data: { stations }
      } = respData;
      setTripData(stations);
    };
    if (loading) fetchTrip();
  }, [loading]);

  const renderStations = () => {
    return (
      <div className="content-wrapper">
        {loading
          ? [null, null].map((_, i) => <SkeletonStation key={i} />)
          : tripData !== null &&
            tripData.length > 0 && (
              <>
                <Station
                  key={tripData[0]._id}
                  index={0}
                  customImage={marker_begin}
                  {...tripData[0]}
                />
                <Station
                  key={tripData[1]._id}
                  index={1}
                  customImage={marker_dest}
                  {...tripData[1]}
                />
              </>
            )}
      </div>
    );
  };

  const renderInputs = () => (
    <div className="row-inputs-trip">
      <div className="column">
        <FaLocationArrow size={20} color="#00f7a8" />
        <GoPrimitiveDot style={{ marginTop: "10px" }} size={8} />
        <GoPrimitiveDot size={8} />
        <GoPrimitiveDot size={8} />
        <FaMapMarkerAlt
          size={20}
          color="#f70044"
          style={{ marginTop: "10px" }}
        />
      </div>
      <div className="column" style={{ flex: 4 }}>
        <SearchInput
          inputValue={from}
          setInputValue={setFrom}
          placeholder="Start"
        />
        <SearchInput
          inputValue={to}
          setInputValue={setTo}
          placeholder="Destination"
        />
      </div>
    </div>
  );

  const handleClick = async () => {
    if (from !== "" && to !== "") {
      setLoading(true);
    }
  };

  const renderStart = () => (
    <div onClick={() => handleClick()} className="start-button">
      <p
        className="important-text-weather"
        style={{ color: "white", fontSize: "18px" }}
      >
        GO
      </p>
    </div>
  );

  return (
    <div className="content-wrapper" style={{ alignItems: "center" }}>
      {renderInputs()}
      {renderStart()}
      {renderStations()}
    </div>
  );
};

export default Trip;
