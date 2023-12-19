import { Box, Button } from "@mui/material";
import { useCallback } from "react";

const FriendshipActions = ({ friendship, currentUser, profileUser }) => {
  const addFriend = useCallback(() => {});

  const removeFriend = useCallback(() => {});

  const removeSentRequest = useCallback(() => {});

  const acceptRequest = useCallback(() => {});

  const declineRequest = useCallback(() => {});

  return (
    <Box>
      {friendship == "friends" ? (
        <Button variant="outlined" onClick={() => removeFriend}>
          remove friend
        </Button>
      ) : null}

      {friendship == "pending" ? (
        <Button variant="outlined" onClick={() => removeSentRequest}>
          remove request
        </Button>
      ) : null}

      {friendship == "requestedYou" ? (
        <>
          <Button variant="contained" onClick={() => acceptRequest}>
            accept
          </Button>
          <Button variant="outlined" onClick={() => declineRequest}>
            decline
          </Button>
        </>
      ) : null}

      {friendship == "noRelation" ? (
        <Button variant="contained" onClick={() => addFriend}>
          add friend
        </Button>
      ) : null}
    </Box>
  );
};

export default FriendshipActions;
