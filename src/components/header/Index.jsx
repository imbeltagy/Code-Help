import { Mail, Notifications, Pets, Search } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  IconButton,
  InputBase,
  Stack,
  Toolbar,
  Typography,
  styled,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import { useState } from "react";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const StyledToolbar = styled(Toolbar)({
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
  });

  const BrandText = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    letterSpacing: ".08em",
    display: "none",
    [theme.breakpoints.up("sm")]: { display: "block" },
  }));

  const SearchBar = styled("div")(({ theme }) => ({
    width: "40%",
    background: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    padding: ".25rem .5rem",
    display: "flex",
    alignItems: "center",
    gap: ".5rem",
  }));

  return (
    <AppBar position="static">
      <StyledToolbar>
        {/* Brand */}
        <Box display={{ xs: "block", sm: "none" }}>
          <Pets />
        </Box>
        <BrandText variant="h5" element="span">
          FEED PAGE
        </BrandText>

        {/* Search */}
        <SearchBar>
          <Search sx={{ color: "#a2a2a2" }} />
          <InputBase placeholder="Search..." sx={{ flexGrow: 1 }} />
        </SearchBar>

        {/* Icons XS */}
        <Button
          onClick={handleClick}
          aria-haspopup="true"
          aria-controls="account-menu"
          aria-expanded={open ? "true" : "false"}
          endIcon={<Avatar sx={{ width: "1.8rem", height: "1.8rem" }} alt="Khalid" />}
          sx={{ color: "white", display: { sm: "none" } }}
        >
          Khalid
        </Button>

        {/* Icons SM*/}
        <Stack direction="row" alignItems="center" sx={{ display: { xs: "none", sm: "block" } }}>
          <IconButton>
            <Badge badgeContent={2} color="error">
              <Mail sx={{ fill: "white" }} />
            </Badge>
          </IconButton>
          <IconButton>
            <Badge badgeContent={5} color="error">
              <Notifications sx={{ fill: "white" }} />
            </Badge>
          </IconButton>
          <IconButton
            onClick={handleClick}
            aria-haspopup="true"
            aria-controls="account-menu"
            aria-expanded={open ? "true" : "false"}
          >
            <Avatar sx={{ width: "1.8rem", height: "1.8rem" }} alt="Khalid" />
          </IconButton>
        </Stack>

        {/* Menu */}
        <Menu
          id="account-menu"
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          sx={{ top: "3rem" }}
        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>My account</MenuItem>
          <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Menu>
      </StyledToolbar>
    </AppBar>
  );
};

export default Header;
