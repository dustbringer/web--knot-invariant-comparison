import { createTheme, PaletteMode } from "@mui/material";

export interface Theme {
  palette: {
    mode: PaletteMode;
    primary: {
      main: string;
    };
    secondary: {
      main: string;
    };
    text: {
      primary: string;
      secondary: string;
    };
    background?: {
      default: string;
    };
  };
  typography: {
    fontFamily: string;
    fontSize: number;
    h1: {
      fontSize: string;
      fontWeight: number;
    };
    h2: {
      fontSize: string;
      fontWeight: number;
    };
  };
}

// https://material-ui.com/customization/default-theme/
// https://mui.com/customization/default-theme/#main-content
const typography = {
  fontFamily: "'Open Sans', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'",
  fontSize: 14,
  h1: {
    fontSize: "3.75rem",
    fontWeight: 400,
  },
  h2: {
    fontSize: "3.25rem",
    fontWeight: 400,
  },
};

export const themeLight: Theme = {
  palette: {
    mode: "light",
    primary: {
      main: "#297FDD",
    },
    secondary: {
      main: "#565147",
    },
    text: {
      primary: "#2f3241",
      secondary: "#82848d",
    },
  },
  typography: typography,
};

export const themeDark: Theme = {
  palette: {
    mode: "dark",
    primary: {
      main: "#DC9959",
    },
    secondary: {
      main: "#C6B3A2",
    },
    text: {
      primary: "#DDD",
      secondary: "#807A75",
    },
    background: {
      default: "#1A1A1A",
    },
  },
  typography: typography,
};

export const themePicker = (mode: "dark" | "light") =>
  mode === "dark" ? themeDark : themeLight;
export default themeLight;
