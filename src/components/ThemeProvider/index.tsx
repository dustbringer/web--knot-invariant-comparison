"use client";

import { ThemeProvider } from "@mui/material";
import { useTheme, Theme, ThemeOptions } from "@mui/material/styles";
import { createTheme } from "@mui/material";
import themeLight from "./theme";

export default function MyThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();

  // https://stackoverflow.com/questions/75595281/react-mui-how-can-i-override-a-primary-color-in-a-theme-palette-for-material-ui
  return (
    <ThemeProvider
      theme={createTheme({
        ...theme,
        palette: {
          ...theme.palette,
          ...themeLight.palette,
        },
        typography: {
          // ...theme.typography, // commented out because variants have their inbuilt font family which is bad
          ...themeLight.typography,
        },
      })}
    >
      {children}
    </ThemeProvider>
  );
}
