import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppRoutes from "./AppRoutes";
import { getUserInfo } from "/src/features/user/userSlice";

function App() {
  const { isLogged, username, userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    isLogged && dispatch(getUserInfo(username));
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
