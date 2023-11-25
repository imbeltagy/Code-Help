import { Box, CssBaseline, Stack, ThemeProvider, createTheme, styled } from "@mui/material";
import LeftSidebar from "./components/leftSidebar/Index";
import Feed from "./components/feed/Index";
import Header from "./components/header/Index";
import { useMemo, useState } from "react";

function App() {
  const [mode, setMode] = useState("light");

  const themeMode = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={themeMode}>
      <CssBaseline />
      <Box>
        <Header />
        <Stack direction="row">
          <LeftSidebar mode={mode} setMode={setMode} />
          <Feed />
        </Stack>
      </Box>
    </ThemeProvider>
  );
}

export default App;
