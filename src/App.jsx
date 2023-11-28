import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import AppRoutes from "./AppRoutes";

function App() {
  // Get Theme
  const mode = useSelector((state) => state.theme.mode);

  const theme = useMemo(() => {
    const modifiedTheme = createTheme({
      palette: {
        mode,
      },
      spacing: (i) => `${i * 0.5}rem`,
    });
    modifiedTheme.shadows[1] = "0px 2px 10px 0px rgba(58, 53, 65, 0.1)";
    return modifiedTheme;
  }, [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
