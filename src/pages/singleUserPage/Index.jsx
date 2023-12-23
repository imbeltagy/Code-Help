import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import fetchAPI from "/src/app/fetchAPI/Index";
import { useSelector } from "react-redux";
import { Stack, Typography } from "@mui/material";
import AvatarPic from "/src/common/avatarPic/Index";
import FriendshipActions from "../users/components/FriendshipActions";
import CurrentUserProfile from "./components/CurrentUserProfile";
import QuestionsPreview from "./components/QuestionsPreview";

// Page Component
const SingleUserPage = () => {
  const { userID } = useParams();
  const [noInfoMessage, setNoInfoMessage] = useState("Loading...");
  const [userInfo, setUserInfo] = useState({ isFetching: true });
  const { isFetching, username: currentUser } = useSelector((state) => state.user);

  const setFriendship = useCallback((val) => {
    setUserInfo((prev) => ({ ...prev, friendship: val }));
  }, []);

  useEffect(() => {
    const getUsersInfo = async () => {
      const res = await fetchAPI(`get_user_info?username=${userID}`, "GET");

      if (res.success) {
        const { display_name, brief, state, user_questions } = res.data.user_info; // also need friendShip + userQuestions
        setUserInfo({
          displayName: display_name || userID,
          username: userID,
          brief,
          state,
          friendship: "friends",
          questions: user_questions ? user_questions : [],
          isFetching: false,
        });
      } else {
        setNoInfoMessage("User not exist.");
      }
    };
    !isFetching && userID !== currentUser && setTimeout(getUsersInfo, 500); // setTimeout to avoide errors with database
  }, [isFetching, userID]);

  // Current User Profile
  if (userID === currentUser) return <CurrentUserProfile />;

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
        <FriendshipActions.friends selfUser={currentUser} otherUser={userID} setFriendship={setFriendship} />
      ) : null}
      {userInfo.friendship == "pending" ? (
        <FriendshipActions.pending selfUser={currentUser} otherUser={userID} setFriendship={setFriendship} />
      ) : null}
      {userInfo.friendship == "requestedYou" ? (
        <FriendshipActions.requestedYou selfUser={currentUser} otherUser={userID} setFriendship={setFriendship} />
      ) : null}
      {userInfo.friendship == "noRelation" ? (
        <FriendshipActions.noRelation selfUser={currentUser} otherUser={userID} setFriendship={setFriendship} />
      ) : null}

      {/* User Questions */}
      <QuestionsPreview
        headding="User Questions"
        questionsIds={userInfo.questions?.map((item) => item.QuestionID)}
        isFetching={userInfo.isFetching}
      />
    </Stack>
  );
};

export default SingleUserPage;
