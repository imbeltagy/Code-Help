import { Group, Home, Nightlight, Settings } from "@mui/icons-material";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Switch } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { change } from "/src/features/theme/themeSlice";
import { close } from "/src/features/drawer/drawerSlice";
import { NavLink } from "react-router-dom";

const navigationLinks = [
  { text: "Home Page", icon: <Home color="primary" />, link: "/" },
  { text: "Friends Asks", icon: <Group color="primary" />, link: "/friends-asks" },
  { text: "Users", icon: <Group color="primary" />, link: "/users" },
];

const Nav = () => {
  const mode = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();
  const toggleMode = (e) => {
    e.currentTarget.checked === true ? dispatch(change("dark")) : dispatch(change("light"));
  };

  return (
    <List sx={{ "& a": { color: "inherit" } }}>
      <Stack spacing={1}>
        {navigationLinks.map(({ text, icon, link }, i) => (
          <ListItem disablePadding key={i}>
            <ListItemButton component={NavLink} to={link} onClick={() => dispatch(close())} sx={{ pl: 2.6 }}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
        {/* Theme Mode */}
        <ListItem disablePadding>
          <ListItemButton sx={{ pl: 2.6 }}>
            <ListItemIcon>
              <Nightlight color="primary" />
            </ListItemIcon>
            <Switch checked={mode === "dark"} onChange={toggleMode} />
          </ListItemButton>
        </ListItem>
      </Stack>
    </List>
  );
};

export default Nav;
