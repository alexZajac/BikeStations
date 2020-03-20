const BIKE_TYPE = "bikes";
const TRAIN_TYPE = "trains";

const defaultOptions = {
  city: "Paris",
  type: BIKE_TYPE
};

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

const typeOptions = [
  {
    label: "Bikes",
    value: "bikes"
  },
  {
    label: "Trains",
    value: "trains"
  }
];

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
  typeOptions
};
