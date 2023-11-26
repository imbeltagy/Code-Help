import styled from "@emotion/styled";
import {
  AttachMoneyOutlined,
  ChatBubbleOutlineOutlined,
  EmailOutlined,
  ExitToAppOutlined,
  GroupOutlined,
  HelpOutlineOutlined,
  Notifications,
  NotificationsOutlined,
  PersonOutlineOutlined,
  SettingsOutlined,
} from "@mui/icons-material";
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
import { useCallback, useState } from "react";

// Profile Picture
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-dot": {
    top: "auto",
    bottom: "-5%",
    right: "14%",
    outline: `2px solid ${theme.palette.background.default}`,
  },
}));

const ProfilePic = () => (
  <StyledBadge variant="dot" color="success">
    <Avatar src="" alt="User Avatar" />
  </StyledBadge>
);

// Menu
const menuItems = [
  { icon: <PersonOutlineOutlined />, text: "Profile" },
  { icon: <GroupOutlined />, text: "Friends" },
  { icon: <ExitToAppOutlined />, text: "Logout" },
];

const ProfileButton = () => {
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
        <ProfilePic />
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
            <ProfilePic />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="subtitle2" fontWeight="600" letterSpacing=".3px">
                John Doe
              </Typography>
            }
            secondary={
              <Typography variant="caption" letterSpacing=".5px">
                online
              </Typography>
            }
          />
        </ListItem>

        <Divider sx={{ mb: 1 }} />

        {/* Items */}
        {menuItems.map((e, i) => (
          <MenuItem onClick={handleClose} key={i} sx={{ padding: ".5rem 1rem" }}>
            <ListItemIcon>{e.icon}</ListItemIcon>
            <ListItemText>{e.text}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ProfileButton;
