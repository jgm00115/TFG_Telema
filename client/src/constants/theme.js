import colours from './colours';

const theme = {
  general: {
    backgroundColour: colours.black,
    colour: colours.grey[500],
  },
  header: {
    colour: colours.white,
    liveCircleColour: colours.red,
  },
  card: {
    backgroundColour: colours.white,
  },
  icon: {
    defaultColor: colours.white,
  },
  button: {
    primary: {
      backgroundColor: colours.blue,
      colour: colours.white,
    },
    secondary: {
      backgroundColor: colours.grey[100],
      colour: colours.blue,
    },
    darkPrimary: {
      backgroundColor: colours.white,
      colour: colours.grey[900],
    },
    darkSecondary: {
      backgroundColor: colours.grey[500],
      colour: colours.grey[100],
    },
  },
  iconButton: {
    basic: {
      colour: colours.white,
      backgroundColour: 'transparent',
    },
    circle: {
      colour: colours.blue,
      backgroundColour: colours.grey[100],
    },
  },
  dot: {
    backgroundColor: colours.grey[200],
  },
  dotActive: {
    backgroundColor: colours.blue,
  },
  switch: {
    light: {
      backgroundColor: colours.grey[100],
    },
    dark: {
      backgroundColor: colours.grey[400],
    },
  },
  imageRadio: {
    colourLight: colours.blue,
    colourDark: colours.white,
    backgroundColourLight: colours.grey[100],
    backgroundColourDark: colours.grey[900],
    borderColourActiveLight: colours.blue,
    borderColourActiveDark: colours.white,
  },
  message: {
    colour: colours.white,
  },
  largeHeader: {
    colour: colours.white,
  },
  overlay: {
    backgroundColor: colours.black,
  },
};

export default theme;
