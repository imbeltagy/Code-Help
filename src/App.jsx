import { Box, Container, CssBaseline, Stack, ThemeProvider, createTheme, styled } from "@mui/material";
import Sidebar from "./layout/sidebar/Index";
import Feed from "./layout/feed/Index";
import Header from "./layout/header/Index";
import { useMemo } from "react";
import { useSelector } from "react-redux";

function App() {
  const mode = useSelector((state) => state.theme.mode);

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
