import styled from "@emotion/styled";
import { ExitToAppOutlined, GroupOutlined, PersonOutlineOutlined } from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "/src/features/user/userSlice";
import { useNavigate } from "react-router-dom";

// Profile Picture
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-dot": {
    top: "auto",
    bottom: "-5%",
    right: "14%",
    outline: `2px solid ${theme.palette.background.default}`,
  },
}));

const ProfilePic = ({ userImg, displayName, userState }) => (
  <StyledBadge
    variant="dot"
    color={userState === "online" ? "success" : userState === "busy" ? "warning" : userState === "offline" && "error"}
  >
    <Avatar src={userImg} alt={displayName} />
  </StyledBadge>
);

// Menu
const menuLinks = [
  { icon: <PersonOutlineOutlined />, text: "Profile", link: "/profile" },
  { icon: <GroupOutlined />, text: "Friends", link: "/friends" },
];

const ProfileButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get User Data
  const [userImg, setUserImg] = useState("");
  const { displayName, userState } = useSelector((state) => state.user.userMainInfo);
  const StatfulProfilePic = () => <ProfilePic userImg={userImg} displayName={displayName} userState={userState} />;

  useEffect(() => {
    // Get Minimized Image From API
    setUserImg("");
  }, []);

  // Menu Functions
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const open = Boolean(anchorEl);
  const id = open ? "profile-settings-menu" : undefined;

  return (
    <>
      <IconButton
        id="profile-settings-button"
        aria-label="profile settings menu"
        aria-controls={open ? "profile-settings-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : "undefined"}
        onClick={handleClick}
        sx={{ padding: 0, marginLeft: "6px" }}
      >
        <StatfulProfilePic />
      </IconButton>

      {/* Menu */}
      <Menu
        id={id}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "profile-settings-button",
        }}
        // Position
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        // Style
        sx={{
          marginTop: "1rem",
          "& .MuiPaper-root": { backgroundImage: "none" },
          "& .MuiList-root": { minWidth: "14rem" },
        }}
      >
        {/* Header */}
        <ListItem sx={{ marginBottom: ".25rem" }}>
          <ListItemIcon>
            <StatfulProfilePic />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="subtitle2" fontWeight="600" letterSpacing=".3px">
                {displayName}
              </Typography>
            }
            secondary={
              <Typography variant="caption" letterSpacing=".5px">
                {userState}
              </Typography>
            }
          />
        </ListItem>

        <Divider sx={{ mb: 1 }} />

        {/* Links */}
        {menuLinks.map(({ text, icon, link }, i) => (
          <MenuItem
            onClick={() => {
              handleClose();
              navigate(link);
            }}
            key={i}
            sx={{ padding: ".5rem 1rem" }}
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText>{text}</ListItemText>
          </MenuItem>
        ))}

        {/* Logout Button */}
        <MenuItem
          onClick={() => {
            handleClose();
            dispatch(logout());
          }}
          sx={{ padding: ".5rem 1rem" }}
        >
          <ListItemIcon>
            <ExitToAppOutlined />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ProfileButton;
