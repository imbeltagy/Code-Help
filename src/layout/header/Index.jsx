import styled from "@emotion/styled";
import { DarkModeOutlined, Menu, Search, WbSunnyOutlined } from "@mui/icons-material";
import { Button, IconButton, InputBase, Stack, Toolbar } from "@mui/material";
import React, { useCallback } from "react";
import Notifications from "./components/Notifications";
import ProfileButton from "./components/ProfileButton";
import { useDispatch, useSelector } from "react-redux";
import { open } from "/src/features/drawer/drawerSlice";

// Styled Components
const SearchBar = styled(Stack)(({ theme }) => ({
  gap: ".5rem",
  borderRadius: "10rem",
  border: `2px solid ${theme.palette.text.disabled}`,
  "&:hover": { borderColor: theme.palette.text.secondary },
  "& path": { fill: theme.palette.text.secondary },
  "&:has(*:focus)": { borderColor: theme.palette.primary.main },
}));

// Main Component
const Header = () => {
  const dispatch = useDispatch();
  const isLogged = useSelector((state) => state.user.isLogged);

  return (
    <Toolbar sx={{ justifyContent: "space-between", paddingInline: "0 !important" }}>
      <Stack direction="row" alignItems="center">
        {/* Open SideBar */}
        <IconButton edge="start" onClick={() => dispatch(open())} sx={{ display: { lg: "none" }, marginRight: "1rem" }}>
          <Menu />
        </IconButton>

        {/* Search Bar */}
        <SearchBar direction="row" alignItems="center" p=".15rem .8rem">
          <Search sx={{ width: "1.4rem" }} />
          <InputBase />
        </SearchBar>
      </Stack>

      {/* Buttons */}
      <Stack direction="row" alignItems="center" gap={1}>
        {isLogged ? (
          <>
            <Notifications />
            <ProfileButton />
          </>
        ) : (
          <>
            <Button>Login</Button>
            <Button variant="outlined">Sign In</Button>
          </>
        )}
      </Stack>
    </Toolbar>
  );
};

export default Header;
