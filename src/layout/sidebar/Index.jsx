import { Box, Drawer, Stack, Typography, useMediaQuery } from "@mui/material";
import React, { useCallback, useRef } from "react";
import Nav from "./Nav";
import styled from "@emotion/styled";
import { useTheme } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import { close } from "/src/features/drawer/drawerSlice";
import { Code, Help } from "@mui/icons-material";

const ScrollShadow = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  height: "0",
  zIndex: 120,
  "&::before": {
    content: '""',
    display: "block",
    width: "calc(100% - 20px)",
    transition: "opacity .3s, height .3s",
    opacity: 0,
    height: 0,
    backgroundImage:
      theme.palette.mode === "light"
        ? "linear-gradient(#F4F5FA 40%,rgba(244, 245, 250, 0.1) 95%,rgba(244, 245, 250, 0.05));"
        : "linear-gradient(rgb(40, 36, 61) 40%, rgba(40, 36, 61, 0.1) 95%, rgba(40, 36, 61, 0.05))",
  },
  "&.show::before": {
    opacity: 1,
    height: "4rem",
  },
}));

const Content = () => {
  const scrollShadowRef = useRef();

  return (
    <>
      {/* Brand */}
      <Stack direction="row" alignItems="center" spacing={1.5} p="1rem 1.3rem">
        <Code fontSize="large" color="primary" />
        <Typography fontWeight="600" letterSpacing=".5px" variant="h5" component="span">
          Code Help
        </Typography>
      </Stack>
      <ScrollShadow ref={scrollShadowRef}></ScrollShadow>
      {/* List */}
      <Stack
        minWidth="16rem"
        pr={1.5}
        overflow="auto"
        onScroll={(e) => {
          e.target.scrollTop > 0
            ? scrollShadowRef.current.classList.add("show")
            : scrollShadowRef.current.classList.remove("show");
        }}
        sx={{
          position: "relative",
        }}
      >
        <Nav />
      </Stack>
    </>
  );
};

const Sidebar = () => {
  const isOpen = useSelector((state) => state.drawer.isOpen);
  const dispatch = useDispatch();

  const { breakpoints } = useTheme();
  const isMdScreen = useMediaQuery(breakpoints.up("lg"));

  if (isMdScreen) {
    return (
      <Stack height="100svh">
        <Content />
      </Stack>
    );
  } else {
    return (
      <Drawer
        sx={{
          "& .MuiPaper-root": { backgroundImage: "none" },
        }}
        anchor="left"
        open={isOpen}
        onClose={() => {
          dispatch(close());
        }}
      >
        <Content />
      </Drawer>
    );
  }
};

export default Sidebar;
