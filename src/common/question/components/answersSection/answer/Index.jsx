import { Stack } from "@mui/material";
import AvatarPic from "/src/common/avatarPic/Index";
import AnswerContent from "./components/AnswerContent";
import AnswerActions from "./components/AnswerActions";
import { useSelector } from "react-redux";

const Answer = ({ questionId, answerId, username, displayName, content, date }) => {
  const currentUser = useSelector((state) => state.user.username);

  return (
    <Stack direction="row" gap={2}>
      <AvatarPic displayName={displayName} />

      <AnswerContent {...{ username, displayName, content, date }} />

      {username == currentUser ? <AnswerActions questionId={questionId} answerId={answerId} /> : null}
    </Stack>
  );
};

export default Answer;
