import { Card, CardContent, Stack, Typography } from "@mui/material";
import AvatarPic from "/src/common/avatarPic/Index";
import { useSelector } from "react-redux";
import FriendshipActions from "./FriendshipActions";
import { useState } from "react";

// Main Component
const UserCard = ({ username, displayName, friendshipState }) => {
  const { isLogged, username: currentUser } = useSelector((state) => state.user);
  const [friendship, setFriendship] = useState(friendshipState);

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
            {!isLogged || friendship == "friends" ? (
              <FriendshipActions.friends
                selfUser={currentUser}
                otherUser={username}
                setFriendship={setFriendship}
                viewProfile
                fullWidth
              />
            ) : null}
            {isLogged && friendship == "pending" ? (
              <FriendshipActions.pending
                selfUser={currentUser}
                otherUser={username}
                setFriendship={setFriendship}
                viewProfile
                fullWidth
              />
            ) : null}
            {isLogged && friendship == "requestedYou" ? (
              <FriendshipActions.requestedYou
                selfUser={currentUser}
                otherUser={username}
                setFriendship={setFriendship}
                viewProfile
                fullWidth
              />
            ) : null}
            {isLogged && friendship == "noRelation" ? (
              <FriendshipActions.noRelation
                selfUser={currentUser}
                otherUser={username}
                setFriendship={setFriendship}
                viewProfile
                fullWidth
              />
            ) : null}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default UserCard;