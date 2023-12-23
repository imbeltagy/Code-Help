import { Box, Stack } from "@mui/material";
import AvatarPic from "/src/common/avatarPic/Index";
import AnswerContent from "./components/AnswerContent";
import AnswerActions from "./components/AnswerActions";
import { useSelector } from "react-redux";

const Answer = ({ questionId, answerId, username, displayName, content, date }) => {
  const currentUser = useSelector((state) => state.user.username);

  return (
    <Stack direction="row">
      <Box mr={2}>
        <AvatarPic displayName={displayName} />
      </Box>

      <AnswerContent {...{ username, displayName, content, date }} />

      {username == currentUser ? (
        <Stack justifyContent="center" ml={1}>
          <AnswerActions questionId={questionId} answerId={answerId} />
        </Stack>
      ) : null}
    </Stack>
  );
};

export default Answer;
