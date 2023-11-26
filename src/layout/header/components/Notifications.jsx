import styled from "@emotion/styled";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const StyledMenuItem = styled(MenuItem)({
  paddingTop: ".75rem",
  paddingBottom: ".75rem",
});

const StyledDivider = styled(Divider)({
  margin: "0 !important",
});

const Notifications = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [notificationsCount, setNotificationsCount] = useState(0);

  // Fake API
  useEffect(() => {
    setTimeout(() => {
      const ApiNots = [
        {
          avatar: "",
          alt: "Imy",
          title: "Congratulation Flora! 🎉",
          description: "Won the monthly best seller badge",
          date: "Today",
        },
        { avatar: "", alt: "VU", title: "New user registered.", description: "5 hours ago", date: "Yesterday" },
        {
          avatar: "",
          alt: "Ali",
          title: "New message received 👋🏻",
          description: "You have 10 unread messages",
          date: "11 Aug",
        },
        {
          avatar: "",
          alt: "Paypal",
          title: "Paypal",
          description: "Received Payment",
          date: "25 May",
        },
        {
          avatar: "",
          alt: "Yaeesr",
          title: "Revised Order 📦",
          description: "New order revised from john",
          date: "19 Mar",
        },
      ];
      setNotificationsCount(8);
      setNotifications(ApiNots);
    }, 500);
  }, []);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const open = Boolean(anchorEl);
  const id = open ? "notifications-menu" : undefined;

  return (
    <>
      <IconButton
        id="notifications-menu-button"
        aria-label="Notifications menu"
        aria-controls={open ? "notifications-menu-button" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : "undefined"}
        onClick={handleClick}
      >
        <Badge badgeContent={notificationsCount} color="error">
          <NotificationsOutlinedIcon />
        </Badge>
      </IconButton>

      {/* Menu */}
      <Menu
        id={id}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "notifications-menu-button",
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
          "& .MuiPaper-root": { backgroundImage: "none", width: "24rem" },
          "& .MuiList-root": { padding: 0 },
        }}
      >
        {/* Header */}
        <StyledMenuItem disableRipple>
          <ListItemText primary="Notifications" sx={{ "& span": { fontWeight: 600 } }} />
          <ListItemSecondaryAction>
            <Chip color="primary" label="8 New" size="small" />
          </ListItemSecondaryAction>
        </StyledMenuItem>
        <StyledDivider />

        {/* Items */}
        <Box>
          {notifications.map(({ avatar, alt, title, description, date }, i) => (
            <React.Fragment key={i}>
              <StyledMenuItem onClick={handleClose}>
                <ListItemAvatar>
                  <Avatar src={avatar} alt={alt} />
                </ListItemAvatar>
                <ListItemText
                  primary={title}
                  secondary={description}
                  sx={{ "& span, & p": { textOverflow: "ellipsis", width: "80%", overflow: "hidden" } }}
                />
                <ListItemSecondaryAction>
                  <Typography variant="caption">{date}</Typography>
                </ListItemSecondaryAction>
              </StyledMenuItem>
              <StyledDivider />
            </React.Fragment>
          ))}
        </Box>

        {/* All Notifications Button */}
        <StyledMenuItem disableRipple>
          <Button
            onClick={() => {
              handleClose();
              navigate("/notifications");
            }}
            variant="contained"
            fullWidth
          >
            READ ALL NOTIFICATIONS
          </Button>
        </StyledMenuItem>
      </Menu>
    </>
  );
};

export default Notifications;
