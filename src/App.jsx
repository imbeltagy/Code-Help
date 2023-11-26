import { Container, CssBaseline, Stack, ThemeProvider, createTheme } from "@mui/material";
import Sidebar from "./layout/sidebar/Index";
import Feed from "./layout/feed/Index";
import Header from "./layout/header/Index";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./features/user/userSlice";

function App() {
  const mode = useSelector((state) => {
    state.theme.mode;
  });
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

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
        spacing: (i) => `${i * 0.5}rem`,
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Stack direction="row">
        <Sidebar />
        <Container>
          <Header />
          <Feed />
        </Container>
      </Stack>
    </ThemeProvider>
  );
}

export default App;
