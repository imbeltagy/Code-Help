import { Group, Home, Nightlight, Settings } from "@mui/icons-material";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Switch } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { change } from "/src/features/theme/themeSlice";
import { close } from "/src/features/drawer/drawerSlice";

const ListItems = [
  { text: "Home Page", icon: <Home color="primary" />, link: "#" },
  { text: "Friends Asks", icon: <Group color="primary" />, link: "#" },
  { text: "Account Settings", icon: <Settings color="primary" />, link: "#" },
];

const Nav = () => {
  const mode = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();
  const toggleMode = (e) => {
    e.currentTarget.checked === true ? dispatch(change("dark")) : dispatch(change("light"));
    setChecked(e.currentTarget.checked);
  };

  return (
    <List sx={{ "& a": { color: "inherit" } }}>
      <Stack spacing={1}>
        {ListItems.map(({ text, icon, link }, i) => (
          <ListItem disablePadding component="a" href={link} key={i}>
            <ListItemButton onClick={() => dispatch(close())} sx={{ pl: 2.6 }}>
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
