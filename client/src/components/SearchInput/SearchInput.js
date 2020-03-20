import React from "react";
import "./SearchInput.css";
import { FiSearch } from "react-icons/fi";

const SearchInput = ({ inputValue, setInputValue }) => {
  return (
    <div className="input-container">
      <FiSearch color="#BD2333" size={30} />
      <input
        value={inputValue}
        placeholder="Nom..."
        onChange={e => setInputValue(e.target.value)}
        className="search-input"
      />
    </div>
  );
};

export default SearchInput;
