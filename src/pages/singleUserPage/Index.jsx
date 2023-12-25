import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import fetchAPI from "/src/app/fetchAPI/Index";
import { useSelector } from "react-redux";
import { Badge, Stack, Typography, styled } from "@mui/material";
import FriendshipActions from "../users/components/FriendshipActions";
import CurrentUserProfile from "./components/CurrentUserProfile";
import QuestionsPreview from "./components/QuestionsPreview";
import MiniUserData from "./components/MiniUserData";

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
      const res = await fetchAPI(`get_user_info?username=${userID}&currentUsername=${currentUser}`, "GET");
      if (res.success) {
        const { display_name, brief, state, relation, user_questions } = res.data.user_info;
        setUserInfo({
          displayName: display_name || userID,
          username: userID,
          brief,
          state,
          friendship: relation,
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

  const actionsProps = {
    selfUser: currentUser,
    otherUser: userID,
    setFriendship: setFriendship,
  };

  const friendshipAction = () => {
    switch (userInfo.friendship) {
      case "friends":
        return <FriendshipActions.friends {...actionsProps} />;
      case "pending":
        return <FriendshipActions.pending {...actionsProps} />;
      case "requested":
        return <FriendshipActions.requestedYou {...actionsProps} />;
      case "noRelation":
      case "no_relation":
        return <FriendshipActions.noRelation {...actionsProps} />;
      default:
        return null;
    }
  };

  // User Info if Exist
  return (
    <Stack alignItems="flex-start">
      {/* Avatar & Name */}
      <MiniUserData state={userInfo.state} displayName={userInfo.displayName} />

      <Typography mb="1rem">{userInfo.brief}</Typography>

      {/* Friendship Actions */}
      {friendshipAction()}

      {/* User Questions */}
      <QuestionsPreview headding="User Questions" questionsIds={userInfo.questions} isFetching={userInfo.isFetching} />
    </Stack>
  );
};

export default SingleUserPage;
