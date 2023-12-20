import { Box, Button, Stack } from "@mui/material";
import { useCallback } from "react";
import fetchApi from "/src/app/fetchApi/Index";
import { Link } from "react-router-dom";

const FriendshipActions = () => {};

// View Profile Action
const ViewProfileBtn = ({ username, fullWidth }) => (
  <Button component={Link} to={`./${username}`} variant="outlined" {...{ fullWidth }}>
    view profile
  </Button>
);

// Friends Action
FriendshipActions.friends = ({ selfUser, otherUser, viewProfile, fullWidth }) => {
  const removeFriend = useCallback(() => {
    const requestApi = async () => {
      const res = await fetchApi("", "");
      if (res.sucess) {
      } else {
      }
    };
    requestApi();
  }, []);

  return (
    <Stack spacing={1} {...(fullWidth && { width: "100%" })}>
      <Button variant="outlined" onClick={() => removeFriend()} {...{ fullWidth }}>
        remove friend
      </Button>
      {viewProfile ? <ViewProfileBtn username={otherUser} {...{ fullWidth }} /> : null}
    </Stack>
  );
};

// Pending Action
FriendshipActions.pending = ({ selfUser, otherUser, viewProfile, fullWidth }) => {
  const removeSentRequest = useCallback(() => {
    const requestApi = async () => {
      const res = await fetchApi("", "");
      if (res.sucess) {
      } else {
      }
    };
    requestApi();
  }, []);

  return (
    <Stack spacing={1} {...(fullWidth && { width: "100%" })}>
      <Button variant="outlined" onClick={() => removeSentRequest()} {...{ fullWidth }}>
        remove request
      </Button>
      {viewProfile ? <ViewProfileBtn username={otherUser} {...{ fullWidth }} /> : null}
    </Stack>
  );
};

// Requested You Action
FriendshipActions.requestedYou = ({ selfUser, otherUser, viewProfile, fullWidth }) => {
  const acceptRequest = useCallback(() => {
    const requestApi = async () => {
      const res = await fetchApi("", "");
      if (res.sucess) {
      } else {
      }
    };
    requestApi();
  }, []);

  const declineRequest = useCallback(() => {
    const requestApi = async () => {
      const res = await fetchApi("", "");
      if (res.sucess) {
      } else {
      }
    };
    requestApi();
  }, []);

  return (
    <Stack spacing={1} {...(fullWidth && { width: "100%" })}>
      <Button variant="contained" onClick={() => acceptRequest()} {...{ fullWidth }}>
        accept
      </Button>
      <Button variant="outlined" onClick={() => declineRequest()} {...{ fullWidth }}>
        decline
      </Button>
      {viewProfile ? <ViewProfileBtn username={otherUser} {...{ fullWidth }} /> : null}
    </Stack>
  );
};

// No Relation Action
FriendshipActions.noRelation = ({ selfUser, otherUser, viewProfile, fullWidth }) => {
  const addFriend = useCallback(() => {
    const requestApi = async () => {
      const res = await fetchApi("", "");
      if (res.sucess) {
      } else {
      }
    };
    requestApi();
  }, []);

  return (
    <Stack spacing={1} {...(fullWidth && { width: "100%" })}>
      <Button variant="contained" onClick={() => addFriend()} {...{ fullWidth }}>
        add friend
      </Button>
      {viewProfile ? <ViewProfileBtn username={otherUser} {...{ fullWidth }} /> : null}
    </Stack>
  );
};

export default FriendshipActions;
