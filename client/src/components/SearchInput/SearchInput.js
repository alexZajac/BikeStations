import React from "react";
import "./SearchInput.css";

const SearchInput = ({ inputValue, setInputValue, placeholder }) => (
  <div className="input-container">
    <input
      value={inputValue}
      placeholder={placeholder}
      onChange={({ target: { value } }) => setInputValue(value)}
      className="search-input"
    />
  </div>
);

export default SearchInput;
