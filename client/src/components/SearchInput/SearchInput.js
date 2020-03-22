import React from "react";
import "./SearchInput.css";

const SearchInput = ({ inputValue, setInputValue, placeholder }) => {
  return (
    <div className="input-container">
      <input
        value={inputValue}
        placeholder={placeholder}
        onChange={e => setInputValue(e.target.value)}
        className="search-input"
      />
    </div>
  );
};

export default SearchInput;
