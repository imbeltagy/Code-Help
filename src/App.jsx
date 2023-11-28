import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./features/user/userSlice";
import AppRoutes from "./AppRoutes";

function App() {
  const dispatch = useDispatch();
  // Check If User Data Is Saved
  useEffect(() => {
    const id = localStorage.getItem("userId");
    // If Logged
    if (id) {
      // Get Data From API
      dispatch(login({ id, username: "John354", displayName: "John Doe", userState: "online" }));
    }
  }, []);

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
