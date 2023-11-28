import { CardContent, Stack } from "@mui/material";
import Answer from "./Answer";
import { forwardRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pushAnswers } from "/src/features/viewedQuestions/viewedQuestionsSlice";

// Temp API Data
const postsAnswers = {
  123: {
    1: { username: "Alice", content: "Looks delicious!" },
    2: { username: "Bob", content: "I'll definitely try this recipe!" },
    3: { username: "Charlie", content: "Great idea for a healthy meal!" },
  },
  749: {
    1: { username: "David", content: "Love this recipe!" },
    2: { username: "Emily", content: "One of my favorite dishes!" },
    3: { username: "Frank", content: "Can't wait to make it again!" },
  },
  196: {
    1: { username: "Grace", content: "I make this regularly, it's amazing!" },
    2: { username: "Henry", content: "Perfect for a weekend dinner!" },
    3: { username: "Isabella", content: "Love the combination of flavors!" },
  },
};

const AnswersSection = ({ id }) => {
  const dispatch = useDispatch();
  const answers = useSelector((state) => state.viewedQuestions.viewedQuestions[id]?.answers) || {};

  // Request Data From API
  useEffect(() => {
    setTimeout(() => {
      dispatch(pushAnswers({ id, data: postsAnswers[id] }));
    }, 500);
  }, []);

  return (
    <CardContent>
      <Stack gap={2} paddingBlock={2}>
        {Object.keys(answers).map((key) => (
          <Answer username={answers[key].username} content={answers[key].content} key={key} />
        ))}
      </Stack>
    </CardContent>
  );
};

export default AnswersSection;
