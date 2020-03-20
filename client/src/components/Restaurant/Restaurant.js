import React from "react";
import "./Restaurant.css";
import { IoMdPricetag, IoIosStar, IoMdPhonePortrait } from "react-icons/io";
import { GiCookingPot, GiChefToque } from "react-icons/gi";
import Skeleton from "react-loading-skeleton";

// {
//   "name": "Le Louis XV - Alain Ducasse à l'Hôtel de Paris",
//   "imageUrl": "https://d3h1lg3ksw6i6b.cloudfront.net/guide/fr/2020/xlarge/9785_pro_15.jpg",
//   "cookingType": "Cuisine méditerranéenne",
//   "distinction": {
//       "type": "THREE_STARS",
//       "description": "Une cuisine unique. Vaut le voyage !"
//   },
//   "websiteUrl": "http://www.ducasse-paris.com",
//   "phone": "+377 98 06 88 64",
//   "price": {
//       "bottom": 180,
//       "top": 380
//   },
//   "numberVotes": 0,
//   "rating": 0,
//   "address": {
//       "street": "place du Casino",
//       "town": "Monte-Carlo",
//       "zipCode": "98000"
//   },
//   "michelinUrl": "https://guide.michelin.com/fr/fr/monaco-region/monte-carlo/restaurant/le-louis-xv-alain-ducasse-a-l-hotel-de-paris"
// }

const Restaurant = ({ content }) => {
  const getLocation = () =>
    `${content.address.street}, ${content.address.town}, ${content.address.zipCode}`;
  const getPrice = () => `${content.price.bottom} - ${content.price.top} EUR`;
  const getRating = () =>
    `${content.rating} / 5 (${content.numberVotes} votes)`;

  const renderPicture = () => (
    <div className="picture-container">
      <img src={content.imageUrl} className="restaurant-picture" alt="Food" />
    </div>
  );

  const renderContent = () => (
    <div typeof="ns:BikeStation" className="content-container">
      <div className="main-infos">
        <p property="ns:name" className="primary-info">
          {content.name}
        </p>
        <p className="secondary-info">{getLocation()}</p>
      </div>
      <div className="icons-infos">
        <div className="row-infos">
          <IoMdPricetag
            size={20}
            color="#999"
            style={{ marginRight: "10px" }}
          />
          <p className="secondary-info">{getPrice()}</p>
        </div>
        <div className="row-infos">{renderRating()}</div>
        <div className="row-infos">
          <IoMdPhonePortrait
            size={20}
            color="#999"
            style={{ marginRight: "10px" }}
          />
          <p className="secondary-info">{content.phone}</p>
        </div>
        <div className="row-infos">
          <GiCookingPot
            size={20}
            color="#999"
            style={{ marginRight: "10px" }}
          />
          <p className="secondary-info">{content.cookingType}</p>
        </div>
      </div>
    </div>
  );

  const renderRating = () => (
    <>
      {content.rating === 0 ? (
        <>
          <GiChefToque size={20} color="#999" style={{ marginRight: "10px" }} />
          <p className="secondary-info">{content.distinction.description}</p>
        </>
      ) : (
        <>
          <IoIosStar size={20} color="#999" style={{ marginRight: "10px" }} />
          <p className="secondary-info">{getRating()}</p>
        </>
      )}
    </>
  );

  return (
    <div
      className="restaurant-container"
      onClick={() => window.open(content.michelinUrl, "_blank")}
    >
      {renderPicture()}
      {renderContent()}
    </div>
  );
};

const SkeletonRestaurant = () => {
  const renderPicture = () => (
    <div className="picture-container">
      <Skeleton width="30vh" height="25vh" />
    </div>
  );

  const renderContent = () => (
    <div className="content-container">
      <div className="main-infos">
        <div className="row-infos">
          <Skeleton width="10vw" height="3vh" />
        </div>
        <div className="row-infos">
          <Skeleton width="20vw" height="3vh" />
        </div>
      </div>
      <div className="icons-infos">
        <div className="row-infos">
          <Skeleton width="4vw" height="2vh" />
        </div>
        <div className="row-infos">
          <Skeleton width="16vw" height="2vh" />
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
    <div className="restaurant-container">
      {renderPicture()}
      {renderContent()}
    </div>
  );
};

export { Restaurant, SkeletonRestaurant };
