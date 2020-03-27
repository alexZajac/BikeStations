import React, { useState, useEffect } from "react";
import "./Trip.css";

import axios from "axios";
import { GoPrimitiveDot } from "react-icons/go";
import { FaMapMarkerAlt, FaLocationArrow } from "react-icons/fa";

import marker_begin from "../../assets/marker_begin.png";
import marker_dest from "../../assets/marker_dest.png";

import SearchInput from "../SearchInput";
import { Station, SkeletonStation } from "../Station";
import { REALTIME, IS_DEMO, API_URL } from "../../Constants";
import { isNull, hasNoLength, isEmpty } from "../../Utils";

const BASE_ICON_SIZE = 20;
const SMALL_ICON_SIZE = 8;

const Trip = ({ tripData, setTripData, filters }) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isNull(tripData)) setLoading(false);
  }, [tripData]);

  useEffect(() => {
    const fetchTrip = async () => {
      const {
        realtimeOption: { value: realtime }
      } = filters;
      let isRealtime = realtime === REALTIME;
      if (IS_DEMO) isRealtime = true;
      const baseUrl = `${API_URL}/api/v1/trip?start=${encodeURI(
        from
      )}&end=${encodeURI(to)}&realtime=${isRealtime}`;
      let url = baseUrl;
      if (IS_DEMO) url = API_URL + baseUrl;
      const response = await axios(url);
      const { data: respData } = response;
      const {
        data: { stations: tripData }
      } = respData;
      setTripData(tripData);
    };
    if (loading) fetchTrip();
  }, [loading]);

  const renderStations = () => {
    return (
      <div className="content-wrapper">
        {loading
          ? [null, null].map((_, i) => <SkeletonStation key={i} />)
          : !isNull(tripData) &&
            !hasNoLength(tripData) && (
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
        <FaLocationArrow size={BASE_ICON_SIZE} color="#00f7a8" />
        <GoPrimitiveDot style={{ marginTop: "10px" }} size={SMALL_ICON_SIZE} />
        <GoPrimitiveDot size={SMALL_ICON_SIZE} />
        <GoPrimitiveDot size={SMALL_ICON_SIZE} />
        <FaMapMarkerAlt
          size={BASE_ICON_SIZE}
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
    if (!isEmpty(from) && !isEmpty(to)) setLoading(true);
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
    <div
      className="content-wrapper"
      style={{ alignItems: "center", overflowY: "auto" }}
    >
      {renderInputs()}
      {renderStart()}
      {renderStations()}
    </div>
  );
};

export default Trip;
