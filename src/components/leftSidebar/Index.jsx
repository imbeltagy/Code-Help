import { AccountBox, Article, Group, Home, Nightlight, DarkMode, Person, Settings, Store } from "@mui/icons-material";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  styled,
} from "@mui/material";

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({ borderRadius: theme.shape.borderRadius }));

const LeftSidebar = ({ mode, setMode }) => {
  const handleChange = (e) => {
    e.currentTarget.checked === true ? setMode("dark") : setMode("light");
  };

  const ListItems = [
    { text: "Homepage", icon: <Home />, link: "#" },
    { text: "Pages", icon: <Article />, link: "#" },
    { text: "Groups", icon: <Group />, link: "#" },
    { text: "Marketplace", icon: <Store />, link: "#" },
    { text: "Friends", icon: <Person />, link: "#" },
    { text: "Settings", icon: <Settings />, link: "#" },
    { text: "Profile", icon: <AccountBox />, link: "#" },
  ];

  return (
    <Stack p={1} display={{ xs: "none", sm: "flex" }}>
      <List sx={{ "& a": { color: "inherit" } }}>
        {ListItems.map(({ text, icon, link }, i) => (
          <ListItem disablePadding component="a" href={link} key={i}>
            <StyledListItemButton>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={text} />
            </StyledListItemButton>
          </ListItem>
        ))}
        {/* Dark Mode */}
        <ListItem disablePadding>
          <StyledListItemButton>
            <ListItemIcon>
              <Nightlight />
            </ListItemIcon>
            <Switch onChange={handleChange} />
          </StyledListItemButton>
        </ListItem>
      </List>
    </Stack>
  );
};

export default LeftSidebar;
