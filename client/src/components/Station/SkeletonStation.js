import React, { memo } from "react";
import "./Station.css";
import Skeleton from "react-loading-skeleton";

const SkeletonStation = () => {
  const renderPicture = () => (
    <div className="picture-container">
      <Skeleton width="12vw" height="12vw" />
    </div>
  );

  const renderContent = () => (
    <div className="content-container">
      <div className="main-infos">
        <div className="row-infos">
          <Skeleton width="10vw" height="3vh" />
        </div>
        <div className="row-infos">
          <Skeleton width="15vw" height="3vh" />
        </div>
      </div>
      <div className="icons-infos">
        <div className="row-infos">
          <Skeleton width="4vw" height="2vh" />
        </div>
        <div className="row-infos">
          <Skeleton width="12vw" height="2vh" />
        </div>
        <div className="row-infos">
          <Skeleton width="10vw" height="2vh" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="station-container">
      {renderPicture()}
      {renderContent()}
    </div>
  );
};

export default memo(SkeletonStation);
