import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import fetchAPI from "/src/app/fetchAPI/Index";
import { useSelector } from "react-redux";
import { Stack, Typography } from "@mui/material";
import AvatarPic from "/src/common/avatarPic/Index";
import FriendshipActions from "../users/components/FriendshipActions";

// Page Component
const SingleUserPage = () => {
  const { userID } = useParams();
  const [noInfoMessage, setNoInfoMessage] = useState("Loading...");
  const [userInfo, setUserInfo] = useState();
  const { isFetching, username: currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const getUsersInfo = async () => {
      const res = await fetchAPI(`get_user_info?username=${userID}`, "GET");

      if (res.success) {
        const { display_name, brief, state } = res.data.user_info; // also need friendShip + userQuestions
        setUserInfo({ displayName: display_name || userID, username: userID, brief, state, friendship: "friends" });
      } else {
        setNoInfoMessage("User not exist.");
      }
    };
    !isFetching && userID !== currentUser && setTimeout(getUsersInfo, 500); // setTimeout to avoide errors with database

    !isFetching && userID === currentUser && setNoInfoMessage(`Welcome to your profile: ${currentUser}`);
  }, [isFetching, userID]);

  // Error or Loading
  if (!userInfo) return noInfoMessage;

  // User Info if Exist
  return (
    <Stack alignItems="flex-start">
      {/* Avatar & Name */}
      <Stack marginBlock="1rem" spacing={1} direction="row" alignItems="flex-end">
        <AvatarPic displayName={userInfo.displayName} variant="rounded" />
        <Typography variant="h6">{userInfo.displayName}</Typography>
      </Stack>

      {/* Friendship Actions */}

      {userInfo.friendship == "friends" ? (
        <FriendshipActions.friends selfUser={currentUser} otherUser={userID} />
      ) : null}
      {userInfo.friendship == "pending" ? (
        <FriendshipActions.pending selfUser={currentUser} otherUser={userID} />
      ) : null}
      {userInfo.friendship == "requestedYou" ? (
        <FriendshipActions.requestedYou selfUser={currentUser} otherUser={userID} />
      ) : null}
      {userInfo.friendship == "noRelation" ? (
        <FriendshipActions.noRelation selfUser={currentUser} otherUser={userID} />
      ) : null}
    </Stack>
  );
};

export default SingleUserPage;
