import React, { useState, useEffect } from "react";
import "./SearchContainer.css";

import Select from "react-select";

import { selectStyles, cityOptions, typeOptions } from "../../Constants";
import bike_logo from "../../assets/bike_logo.png";

import { Station, SkeletonStation } from "../Station";

const SearchContainer = ({ filters, setFilters, loading, stations }) => {
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

  const renderLogo = () => (
    <div className="logo-container">
      <img alt="Bike stations" src={bike_logo} className="logo" />
    </div>
  );

  const getFilterWidth = () => (viewportWidth > 920 ? "15vw" : "30vw");

  const renderFilters = () => (
    <div className="filters-container">
      <div className="select-container">
        <Select
          options={cityOptions}
          value={filters.city}
          placeholder="City..."
          isSearchable={false}
          styles={selectStyles(getFilterWidth())}
          onChange={city =>
            city !== filters.city &&
            setFilters({
              ...filters,
              city
            })
          }
        />
      </div>
      <div className="select-container">
        <Select
          options={typeOptions}
          value={filters.type}
          placeholder="Station type..."
          isSearchable={false}
          styles={selectStyles(getFilterWidth())}
          onChange={type =>
            type !== filters.type &&
            setFilters({
              ...filters,
              type
            })
          }
        />
      </div>
    </div>
  );

  const renderStations = () => (
    <div className="stations-wrapper">
      {loading
        ? [null, null, null].map((_, i) => <SkeletonStation key={i} />)
        : stations.map(s => <Station key={s._id} {...s} />)}
    </div>
  );

  return (
    <div className="search-container">
      {renderLogo()}
      {renderFilters()}
      {renderStations()}
    </div>
  );
};

export default SearchContainer;
