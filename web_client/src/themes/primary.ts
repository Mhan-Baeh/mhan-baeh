import { createTheme } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    primary: {
      main: "#283DA0",
    },
    secondary: {
      main: "#CECECE",
    },
    error: {
      main: "#FF0000",
    },
    warning: {
      main: "#FFC107",
    },
    info: {
      main: "#17A2B8",
    },
    success: {
      main: "#28A745",
    },
    text: {
      primary: "#000000",
      secondary: "#8A8A8A",
    },
    background: {
      default: "#EBEBEB",
      paper: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: ["Roboto", "sans-serif"].join(","),
    h4: {
      fontWeight: 500,
      fontSize: 35,
      lineHeight: "2rem",
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
});

export const primaryTheme = createTheme(theme, {
  palette: {
    info: {
      main: theme.palette.secondary.main,
    },
  },
});

