import React, { useState, useEffect } from "react";
import "./SearchContainer.css";
import chef_empty from "../../assets/empty_chef.png";
import bib_maitre_logo from "../../assets/bib_maitre_logo.png";
import Select from "react-select";

import {
  distinctionOptions,
  cookingOptions,
  sortingOptions,
  selectStyles
} from "../../Constants";

import { Restaurant, SkeletonRestaurant } from "../Restaurant";
import SearchInput from "../SearchInput";

const SearchContainer = ({ filters, setFilters, loading, restaurants }) => {
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
      <img
        alt="Michelin Bib Gourmand Maître Restaurateur"
        src={bib_maitre_logo}
        className="logo"
      />
    </div>
  );

  const renderInput = () => (
    <SearchInput
      inputValue={filters.query}
      setInputValue={query => setFilters({ ...filters, query })}
    />
  );

  const getFilterWidth = () => (viewportWidth > 920 ? "10vw" : "25vw");

  const renderFilters = () => (
    <div className="filters-container">
      <div className="select-container">
        <Select
          options={distinctionOptions}
          value={filters.distinction}
          placeholder={distinctionOptions[0].label}
          isSearchable={false}
          styles={selectStyles(getFilterWidth())}
          onChange={distinction =>
            distinction !== filters.distinction &&
            setFilters({
              ...filters,
              distinction
            })
          }
        />
      </div>
      <div className="select-container">
        <Select
          options={cookingOptions}
          value={filters.cooking}
          noOptionsMessage={() => "Aucun type de cuisine correspondant"}
          placeholder={cookingOptions[0].label}
          styles={selectStyles(getFilterWidth())}
          onChange={cooking =>
            cooking !== filters.cooking && setFilters({ ...filters, cooking })
          }
        />
      </div>
      <div className="select-container">
        <Select
          options={sortingOptions}
          value={filters.sorting}
          placeholder={sortingOptions[0].label}
          isSearchable={false}
          styles={selectStyles(getFilterWidth())}
          onChange={sorting =>
            sorting !== filters.sorting && setFilters({ ...filters, sorting })
          }
        />
      </div>
    </div>
  );

  const renderRestaurants = () => (
    <div className="restaurant-wrapper">
      {loading
        ? [null, null, null].map((_, i) => <SkeletonRestaurant key={i} />)
        : restaurants.length === 0
        ? renderEmptyChef()
        : restaurants.map(r => <Restaurant key={r._id} content={r} />)}
    </div>
  );

  const renderEmptyChef = () => (
    <div className="logo-container">
      <img alt="Empty results" src={chef_empty} className="empty-logo" />
      <p className="empty-text">
        Aucun restaurant trouvé, vous êtes trop gourmand!
      </p>
    </div>
  );

  return (
    <div className="search-container">
      {renderLogo()}
      {renderInput()}
      {renderFilters()}
      {renderRestaurants()}
    </div>
  );
};

export default SearchContainer;
