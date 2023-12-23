import { Alert, CssBaseline, Snackbar, ThemeProvider, createTheme } from "@mui/material";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppRoutes from "./AppRoutes";
import { getUserInfo } from "./features/user/userSlice";
import { close } from "./features/notification/notificationSlice";

function App() {
  const { isLogged, username, userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { isOpen, message, type } = useSelector((state) => state.notification);

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
      {/* Notification */}
      <Snackbar open={isOpen} autoHideDuration={3000} onClose={() => dispatch(close())}>
        <Alert onClose={() => setOpenAlert(false)} severity={type} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
