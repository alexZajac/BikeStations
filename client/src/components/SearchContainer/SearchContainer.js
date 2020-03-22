import React, { useState, useEffect } from "react";
import "./SearchContainer.css";

import Select from "react-select";
import { Tabs, Tab, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

import Trip from "../Trip";

import {
  selectStyles,
  cityOptions,
  refreshOptions,
  getPollutionData
} from "../../Constants";
import bike_logo from "../../assets/bike_logo.png";

import { Station, SkeletonStation } from "../Station";

const SearchContainer = ({
  filters,
  cityData,
  setFilters,
  loading,
  stations,
  stationFocus,
  setStationFocus
}) => {
  const [viewportWidth, setViewportWidth] = useState(
    document.documentElement.clientWidth
  );
  const [selected, setSelected] = useState(2);

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
          value={{ label: filters.city.label }}
          placeholder="City..."
          isSearchable={false}
          styles={selectStyles(getFilterWidth())}
          onChange={city =>
            setFilters({
              ...filters,
              city
            })
          }
        />
      </div>
      <div className="select-container">
        <Select
          options={refreshOptions}
          value={{ label: filters.refreshOption.label }}
          placeholder="Refresh Interval..."
          isSearchable={false}
          styles={selectStyles(getFilterWidth())}
          onChange={refreshOption =>
            setFilters({
              ...filters,
              refreshOption
            })
          }
        />
      </div>
    </div>
  );

  const renderStations = () => {
    let renderStations = stations;
    let resetButton = null;
    if (stationFocus !== null) {
      resetButton = (
        <div onClick={() => setStationFocus(null)} className="reset-button">
          <p className="reset-text">RESET</p>
        </div>
      );
      renderStations = renderStations.filter(s => s._id === stationFocus);
    }
    return (
      <div className="content-wrapper">
        {loading
          ? [null, null, null].map((_, i) => <SkeletonStation key={i} />)
          : renderStations.map((s, index) => (
              <Station key={s._id} index={index} {...s} />
            ))}
        {resetButton}
      </div>
    );
  };

  const renderWeatherData = () => {
    if (cityData === null) return cityData;
    const { name, temperature, pollutionIndex } = cityData;
    const getTemperature = temp => {
      const tempValue = `${temp} °C`;
      if (temp < 10) return `${tempValue} ❄️`;
      else if (temp < 20) return `${tempValue} ⛅`;
      return `${tempValue} ☀️`;
    };
    const [color, mainText, desc] = getPollutionData(pollutionIndex);
    return (
      <div className="content-wrapper">
        <p className="city">{name}</p>
        <div className="part-weather">
          <p className="title-part-weather">TEMPERATURE</p>
          <p className="important-text-weather">
            {getTemperature(temperature)}
          </p>
        </div>
        <div className="part-weather">
          <p className="title-part-weather">POLLUTION INDEX</p>
          <div className="row">
            <div className="pollution-color" style={{ backgroundColor: color }}>
              <p className="important-text-weather">{pollutionIndex}</p>
            </div>
            <p className="important-text-weather">{mainText}</p>
          </div>
          <p className="desc-pollution">{desc}</p>
        </div>
      </div>
    );
  };

  const renderTabs = () => (
    <Tabs
      forceRenderTabPanel={true}
      onSelect={i => setSelected(i)}
      selectedIndex={selected}
      className="tabs"
    >
      <TabList className="tablist">
        <Tab className={`tab ${selected === 0 ? "active-tab" : ""}`}>
          STATIONS
        </Tab>
        <Tab className={`tab ${selected === 1 ? "active-tab" : ""}`}>
          WEATHER
        </Tab>
        <Tab className={`tab ${selected === 2 ? "active-tab" : ""}`}>TRIP</Tab>
      </TabList>
      <TabPanel>{renderStations()}</TabPanel>
      <TabPanel>{renderWeatherData()}</TabPanel>
      <TabPanel>
        <Trip />
      </TabPanel>
    </Tabs>
  );

  return (
    <div className="search-container">
      {renderLogo()}
      {renderFilters()}
      {renderTabs()}
    </div>
  );
};

export default SearchContainer;
