import { Box, Button, Stack } from "@mui/material";
import { useCallback, useState } from "react";
import fetchApi from "/src/app/fetchApi/Index";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { disable, undisable } from "/src/features/friendshipActions/friendshipActionsSlice";

const FriendshipActions = () => {};

// View Profile Action
const ViewProfileBtn = ({ username, fullWidth }) => (
  <Button component={Link} to={`./${username}`} variant="outlined" {...{ fullWidth }}>
    view profile
  </Button>
);

// Friends Action
FriendshipActions.friends = ({ selfUser, otherUser, viewProfile, fullWidth, setFriendship }) => {
  const disabled = useSelector((state) => state.friendshipActions.disabled);
  const dispatch = useDispatch();

  const removeFriend = async () => {
    // Disable Buttons till request
    dispatch(disable());

    // Rquest Api
    const res = await fetchApi("", "");

    if (res.success) {
      dispatch(undisable());
      setFriendship("noRelation");
    } else {
      dispatch(undisable());
    }
  };

  return (
    <Stack spacing={1} {...(fullWidth && { width: "100%" })}>
      <Button variant="outlined" onClick={() => removeFriend()} {...{ fullWidth, disabled }}>
        remove friend
      </Button>
      {viewProfile ? <ViewProfileBtn username={otherUser} {...{ fullWidth }} /> : null}
    </Stack>
  );
};

// Pending Action
FriendshipActions.pending = ({ selfUser, otherUser, viewProfile, fullWidth, setFriendship }) => {
  const disabled = useSelector((state) => state.friendshipActions.disabled);
  const dispatch = useDispatch();

  const removeSentRequest = async () => {
    // Disable Buttons till request
    dispatch(disable());

    // Rquest Api
    const res = await fetchApi("response_request", "POST", {
      sender_username: selfUser,
      responder_username: otherUser,
      state: "decline",
    });

    if (res.success) {
      dispatch(undisable());
      setFriendship("noRelation");
    } else {
      dispatch(undisable());
    }
  };

  return (
    <Stack spacing={1} {...(fullWidth && { width: "100%" })}>
      <Button variant="outlined" onClick={() => removeSentRequest()} {...{ fullWidth, disabled }}>
        remove request
      </Button>
      {viewProfile ? <ViewProfileBtn username={otherUser} {...{ fullWidth }} /> : null}
    </Stack>
  );
};

// Requested You Action
FriendshipActions.requestedYou = ({ selfUser, otherUser, viewProfile, fullWidth, setFriendship }) => {
  const disabled = useSelector((state) => state.friendshipActions.disabled);
  const dispatch = useDispatch();

  const acceptRequest = async () => {
    // Disable Buttons till request
    dispatch(disable());

    // Rquest Api
    const res = await fetchApi("", "");

    if (res.success) {
      dispatch(undisable());
      setFriendship("noRelation");
    } else {
      dispatch(undisable());
    }
  };

  const declineRequest = async () => {
    // Disable Buttons till request
    dispatch(disable());

    // Rquest Api
    // Rquest Api
    const res = await fetchApi("response_request", "POST", {
      sender_username: otherUser,
      responder_username: selfUser,
      state: "decline",
    });

    if (res.success) {
      dispatch(undisable());
      setFriendship("noRelation");
    } else {
      dispatch(undisable());
    }
  };

  return (
    <Stack spacing={1} {...(fullWidth && { width: "100%" })}>
      <Button variant="contained" onClick={() => acceptRequest()} {...{ fullWidth, disabled }}>
        accept
      </Button>
      <Button variant="outlined" onClick={() => declineRequest()} {...{ fullWidth, disabled }}>
        decline
      </Button>
      {viewProfile ? <ViewProfileBtn username={otherUser} {...{ fullWidth }} /> : null}
    </Stack>
  );
};

// No Relation Action
FriendshipActions.noRelation = ({ selfUser, otherUser, viewProfile, fullWidth, setFriendship }) => {
  const disabled = useSelector((state) => state.friendshipActions.disabled);
  const dispatch = useDispatch();

  const addFriend = async () => {
    // Disable Buttons till request
    dispatch(disable());

    // Rquest Api
    const res = await fetchApi("send_request", "POST", {
      sender_username: selfUser,
      receiver_username: otherUser,
    });

    if (res.success) {
      dispatch(undisable());
      setFriendship("pending");
    } else {
      dispatch(undisable());
    }
  };

  return (
    <Stack spacing={1} {...(fullWidth && { width: "100%" })}>
      <Button variant="contained" onClick={() => addFriend()} {...{ fullWidth, disabled }}>
        add friend
      </Button>
      {viewProfile ? <ViewProfileBtn username={otherUser} {...{ fullWidth }} /> : null}
    </Stack>
  );
};

export default FriendshipActions;
