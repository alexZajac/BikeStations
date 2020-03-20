const distinctionOptions = [
  {
    value: "BIB_GOURMAND",
    label: "Bib Gourmand"
  },
  {
    value: "ONE_STAR",
    label: "1 étoile"
  },
  {
    value: "TWO_STARS",
    label: "2 étoiles"
  },
  {
    value: "THREE_STARS",
    label: "3 étoiles"
  }
];

const cookingOptions = [
  {
    value: "Toutes cuisines",
    label: "Toutes cuisines"
  },
  {
    value: "Cuisine moderne",
    label: "Cuisine moderne"
  },
  {
    value: "Cuisine créative",
    label: "Cuisine créative"
  },
  {
    value: "Cuisine traditionnelle",
    label: "Cuisine traditionnelle"
  },
  {
    value: "Cuisine classique",
    label: "Cuisine classique"
  },
  {
    value: "Cuisine du terroir",
    label: "Cuisine du terroir"
  },
  {
    value: "Cuisine méditerranéenne",
    label: "Cuisine méditerranéenne"
  },
  {
    value: "Cuisine provençale",
    label: "Cuisine provençale"
  },
  {
    value: "Cuisine du marché",
    label: "Cuisine du marché"
  },
  {
    value: "Cuisine régionale",
    label: "Cuisine régionale"
  }
];

const sortingOptions = [
  {
    value: "PRICE_ASC",
    label: "Trier par prix croissant"
  },
  {
    value: "PRICE_DESC",
    label: "Trier par prix décroissant"
  },
  {
    value: "DISTANCE",
    label: "Trier par distance"
  },
  {
    value: "RATING_DESC",
    label: "Trier par note décroissante"
  },
  {
    value: "RATING_ASC",
    label: "Trier par note croissante"
  }
];

const defaultOptions = {
  distinction: distinctionOptions[0],
  cooking: cookingOptions[0],
  sorting: sortingOptions[0],
  query: ""
};

const selectStyles = width => ({
  control: styles => ({
    ...styles,
    width,
    fontSize: "12px"
  }),
  input: styles => ({
    ...styles,
    fontFamily: "Open Sans",
    fontSize: "12px"
  }),
  placeholder: styles => ({
    ...styles,
    fontSize: "12px",
    fontFamily: "Open Sans"
  }),
  singleValue: styles => ({
    ...styles,
    fontFamily: "Open Sans",
    fontSize: "12px"
  }),
  option: styles => ({ ...styles, fontFamily: "Open Sans", fontSize: "12px" })
});

const defaultMapState = {
  viewport: {
    width: "60vw",
    height: "100vh",
    latitude: 48.8534,
    longitude: 2.3488,
    zoom: 12
  }
};

export {
  distinctionOptions,
  cookingOptions,
  sortingOptions,
  defaultOptions,
  selectStyles,
  defaultMapState
};
