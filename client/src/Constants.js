const BIKE_TYPE = "bikes";
const TRAIN_TYPE = "trains";

const cityOptions = [
  {
    label: "Paris",
    value: "Paris"
  },
  {
    label: "Lyon",
    value: "Lyon"
  },
  {
    label: "Montpellier",
    value: "Montpellier"
  },
  {
    label: "Rennes",
    value: "Rennes"
  },
  {
    label: "Strasbourg",
    value: "Strasbourg"
  }
];

const refreshOptions = [
  {
    label: "30 seconds",
    value: "30 seconds"
  },
  {
    label: "1 minute",
    value: "1 minute"
  },
  {
    label: "5 minutes",
    value: "5 minutes"
  },
  {
    label: "30 minutes",
    value: "3 minutes"
  },
  {
    label: "1 hour",
    value: "1 hour"
  },
  {
    label: "24 hours",
    value: "24 hours"
  }
];

const defaultOptions = {
  city: cityOptions[0],
  refreshOption: refreshOptions[0]
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

const coordinates = {
  Paris: {
    latitude: 48.8534,
    longitude: 2.3488
  },
  Rennes: {
    latitude: 48.113,
    longitude: -1.681
  },
  Lyon: {
    latitude: 45.764,
    longitude: 4.8357
  },
  Strasbourg: {
    latitude: 48.5734,
    longitude: 7.7521
  },
  Montpellier: {
    latitude: 43.6108,
    longitude: 3.8767
  }
};

const defaultMapState = {
  viewport: {
    width: "100%",
    height: "100vh",
    latitude: 48.8534,
    longitude: 2.3488,
    zoom: 12
  }
};

export {
  defaultOptions,
  selectStyles,
  defaultMapState,
  cityOptions,
  refreshOptions,
  coordinates
};
