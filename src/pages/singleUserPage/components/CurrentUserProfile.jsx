import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import QuestionsPreview from "./QuestionsPreview";
import FriendsPreview from "./FriendsPreview";
import UpdateInfoForm from "./UpdateInfoForm";
import fetchApi from "/src/app/fetchApi/Index";

const CurrentUserProfile = () => {
  const userInfo = useSelector((state) => state.user);

  // After Response
  return (
    <>
      {/* User Info */}
      <UpdateInfoForm />

      {/* Friends Preview */}
      <FriendsPreview />

      {/* User Questions */}
      <QuestionsPreview headding="User Questions" questionsIds={userInfo.questions} isFetching={userInfo.isFetching} />
    </>
  );
};

export default CurrentUserProfile;
