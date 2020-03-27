import React, { memo } from "react";
import "./Weather.css";

import { isNull, isUndefined } from "../../Utils";

import { getPollutionData } from "../../Constants";

const Weather = memo(({ cityData }) => {
  if (isNull(cityData) || isUndefined(cityData)) return null;
  const { cityName: name, temperature, pollutionIndex } = cityData;
  const getTemperature = temp => {
    const tempValue = `${temp} °C`;
    if (temp < 10) return `${tempValue} ❄️`;
    else if (temp < 20) return `${tempValue} ⛅`;
    return `${tempValue} ☀️`;
  };
  const [color, mainText, desc] = getPollutionData(pollutionIndex);
  return (
    <div typeof="ns:City" className="content-wrapper">
      <p property="ns:cityName" className="city">
        {name}
      </p>
      <div className="part-weather">
        <p property="ns:temperature" className="important-text-weather">
          {getTemperature(temperature)}
        </p>
      </div>
      <div className="part-weather">
        <div className="row">
          <div className="pollution-color" style={{ backgroundColor: color }}>
            <p property="ns:pollutionIndex" className="important-text-weather">
              {pollutionIndex}
            </p>
          </div>
          <p className="important-text-weather">{mainText}</p>
        </div>
        <p property="rdfs:comment" className="desc-pollution">
          {desc}
        </p>
      </div>
    </div>
  );
});

export default memo(Weather);
