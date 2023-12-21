import { Card, CardContent, Stack, Typography } from "@mui/material";
import AvatarPic from "/src/common/avatarPic/Index";
import { useSelector } from "react-redux";
import FriendshipActions from "./FriendshipActions";
import { useState } from "react";

// Main Component
const UserCard = ({ username, displayName, friendshipState }) => {
  const { isLogged, username: currentUser } = useSelector((state) => state.user);
  const [friendship, setFriendship] = useState(friendshipState);

  // The props which will be passed to Buttons
  const actionsProps = {
    selfUser: currentUser,
    otherUser: username,
    setFriendship: setFriendship,
    viewProfile: true,
    fullWidth: true,
  };

  const action = () => {
    switch (friendship) {
      case "friends":
        return <FriendshipActions.friends {...actionsProps} />;
      case "pending":
        return <FriendshipActions.pending {...actionsProps} />;
      case "requestedYou":
        return <FriendshipActions.requestedYou {...actionsProps} />;
      case "noRelation":
        return <FriendshipActions.noRelation {...actionsProps} />;
      default:
        return null;
    }
  };

  return (
    <Card sx={{ height: "100%", display: "grid", alignItems: "center", paddingBlock: "1rem" }}>
      <CardContent>
        <Stack spacing={1} alignItems="center">
          {/* Avatar */}
          <AvatarPic displayName={displayName} />

          {/* Display Name */}
          <Typography pb={1} variant="body1" fontWeight="900" component="span">
            {displayName}
          </Typography>

          {/* Actions Buttons */}
          <Stack spacing={1} width="100%">
            {!isLogged ? <FriendshipActions.ViewProfileBtn username={username} fullWidth /> : action()}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default UserCard;
