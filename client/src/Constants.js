const generateSameObjects = labels =>
  labels.map(label => ({ label, value: label }));

const cityLabels = [
  "Paris",
  "Amiens",
  "Marseille",
  "Mulhouse",
  "Nancy",
  "Nantes",
  "Rouen",
  "Toulouse",
  "Lyon",
  "Montpellier",
  "Rennes",
  "Strasbourg"
];
const realtimeLabels = ["Realtime data", "Static data"];

const cityOptions = generateSameObjects(cityLabels);

const realtimeOptions = generateSameObjects(realtimeLabels);

const defaultOptions = {
  city: cityOptions[0],
  realtimeOption: realtimeOptions[0]
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

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiYWxleHphamFjIiwiYSI6ImNrNnR2cTh1ZTAzODAzZXA3MTZrMG1vd2MifQ.b7r-Znl2mfjKgkeQDPF8tg";

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
  },
  Amiens: {
    latitude: 49.8941,
    longitude: 2.2958
  },
  Marseille: {
    latitude: 43.2965,
    longitude: 5.3698
  },
  Mulhouse: {
    latitude: 47.7508,
    longitude: 7.3359
  },
  Nancy: {
    latitude: 48.6921,
    longitude: 6.1844
  },
  Nantes: {
    latitude: 47.2184,
    longitude: -1.5536
  },
  Rouen: {
    latitude: 49.4432,
    longitude: 1.1
  },
  Toulouse: {
    latitude: 43.6047,
    longitude: 1.4442
  }
};

const defaultMapState = {
  viewport: {
    width: window.innerWidth * 0.6,
    height: window.innerHeight,
    latitude: 48.8534,
    longitude: 2.3488,
    zoom: 11
  }
};

const getPollutionData = value => {
  if (value < 51)
    return [
      "#009966",
      "Good",
      "Air quality is considered satisfactory, and air pollution poses little or no risk."
    ];
  else if (value < 101)
    return [
      "#FFDE33",
      "Moderate",
      "Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution."
    ];
  else if (value < 151)
    return [
      "#FF9933",
      "Unhealthy for Sensitive Groups",
      "Members of sensitive groups may experience health effects. The general public is not likely to be affected."
    ];
  else
    return [
      "#CC0033",
      "Unhealthy",
      "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects."
    ];
};

const MAP_TRANSITION_DURATION = 3000;
const REALTIME = realtimeOptions[0].value;

const initialState = {
  stations: [],
  loading: true,
  filters: defaultOptions,
  focus: null,
  cityData: null,
  tripData: null,
  refreshData: false
};

const resizeEffect = setViewportWidth => {
  const handleResize = () => {
    setViewportWidth(document.documentElement.clientWidth);
  };
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
};

export {
  defaultOptions,
  selectStyles,
  defaultMapState,
  cityOptions,
  realtimeOptions,
  coordinates,
  getPollutionData,
  initialState,
  resizeEffect,
  MAP_TRANSITION_DURATION,
  REALTIME,
  MAPBOX_TOKEN
};
