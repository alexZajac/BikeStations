import React, { useState, useEffect, memo } from "react";
import "./SearchContainer.css";

import Select from "react-select";
import { Tabs, Tab, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { List } from "react-virtualized";
import "react-virtualized/styles.css";

import {
  selectStyles,
  cityOptions,
  realtimeOptions,
  resizeEffect,
  REALTIME
} from "../../Constants";

import { isNull } from "../../Utils";
import bike_logo from "../../assets/bike_logo.png";
import { Station, SkeletonStation } from "../Station";
import Trip from "../Trip";
import Weather from "../Weather";

const FAKE_DATA = [null, null, null];

const tabClass = (index, selected) =>
  `tab ${selected === index ? "active-tab" : ""}`;

const SearchContainer = memo(
  ({
    filters,
    cityData,
    setFilters,
    loading,
    stations,
    focus,
    setFocus,
    tripData,
    setTripData,
    setRefreshData
  }) => {
    const [viewportWidth, setViewportWidth] = useState(
      document.documentElement.clientWidth
    );
    const [selected, setSelected] = useState(0);

    useEffect(() => resizeEffect(setViewportWidth), []);

    const getFilterWidth = () => (viewportWidth > 920 ? "10vw" : "25vw");
    const getListWidth = () =>
      viewportWidth > 920 ? window.innerWidth * 0.37 : window.innerWidth * 0.95;
    const getItemHeight = () =>
      viewportWidth > 920 ? window.innerHeight * 0.25 : window.innerWidth * 0.3;

    const getResetButton = () => (
      <div
        onClick={() => setFocus(null)}
        className="reset-button"
        style={{ alignSelf: "center" }}
      >
        <p className="reset-text">RESET</p>
      </div>
    );

    const renderStations = () => {
      let renderStations = stations;
      let resetButton = null;
      if (!isNull(focus)) {
        resetButton = getResetButton();
        renderStations = renderStations.filter(s => s._id === focus);
        return (
          <div className="content-wrapper">
            <Station
              key={renderStations[0]._id}
              {...renderStations[0]}
              setFocus={setFocus}
            />
            {resetButton}
          </div>
        );
      }
      const rowRenderer = ({ index, key, style }) => (
        <div key={key} style={style}>
          <Station key={renderStations[index]._id} {...renderStations[index]} />
        </div>
      );
      return (
        <>
          {loading ? (
            FAKE_DATA.map((_, i) => <SkeletonStation key={i} />)
          ) : (
            <List
              style={{
                outline: "none"
              }}
              width={getListWidth()}
              height={
                renderStations.length === 1
                  ? window.innerHeight * 0.6
                  : window.innerHeight * 0.66
              }
              rowHeight={getItemHeight()}
              rowCount={renderStations.length}
              rowRenderer={rowRenderer}
            />
          )}
        </>
      );
    };

    const handleSelect = index => {
      if (index !== 2) setTripData(null);
      setSelected(index);
    };

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
            options={realtimeOptions}
            value={{ label: filters.realtimeOption.label }}
            placeholder="Refresh Interval..."
            isSearchable={false}
            styles={selectStyles(getFilterWidth())}
            onChange={realtimeOption =>
              setFilters({
                ...filters,
                realtimeOption
              })
            }
          />
        </div>
        <div className="select-container">
          <div
            onClick={() => setRefreshData(true)}
            className={
              filters.realtimeOption.value === REALTIME
                ? "disabled"
                : "refresh-button"
            }
          >
            <p className="refresh-text">REFRESH</p>
          </div>
        </div>
      </div>
    );

    const renderLogo = () => (
      <div className="logo-container">
        <img alt="Bike stations" src={bike_logo} className="logo" />
      </div>
    );

    const renderTabs = () => (
      <Tabs
        forceRenderTabPanel={true}
        onSelect={i => handleSelect(i)}
        selectedIndex={selected}
        className="tabs"
      >
        <TabList className="tablist">
          <Tab className={tabClass(0, selected)}>STATIONS</Tab>
          <Tab className={tabClass(1, selected)}>WEATHER</Tab>
          <Tab className={tabClass(2, selected)}>TRIP</Tab>
        </TabList>
        <TabPanel style={{ width: "100%" }}>{renderStations()}</TabPanel>
        <TabPanel style={{ width: "100%" }}>
          <Weather cityData={cityData} />
        </TabPanel>
        <TabPanel style={{ width: "100%" }}>
          <Trip
            tripData={tripData}
            filters={filters}
            setTripData={setTripData}
          />
        </TabPanel>
      </Tabs>
    );

    return (
      <div
        className="search-container"
        style={{ overflowY: selected === 2 ? "auto" : "hidden" }}
      >
        {renderLogo()}
        {renderFilters()}
        {renderTabs()}
      </div>
    );
  }
);

export default SearchContainer;
