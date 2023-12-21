import { CardContent, Stack } from "@mui/material";
import Answer from "./Answer";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pushAnswers } from "/src/features/questions/questionsSlice";
import fetchApi from "/src/app/fetchApi/Index";

const AnswersSection = ({ id }) => {
  const dispatch = useDispatch();
  const answers = useSelector((state) => state.questions.savedAnswers[id]) || {};

  // Request Data From API
  useEffect(() => {
    const getAnswers = async () => {
      const res = await fetchApi(`get_question_answers?question_id=${id}`, "GET");
      if (res.success) {
        const answers = {};
        // Refactor Answers keys
        res.data.answers.forEach(({ answer_id, username, display_name, content, publish_date }) => {
          answers[answer_id] = {
            username,
            displayName: display_name,
            content,
            date: new Date(publish_date).getTime(),
          };
        });
        // Save Answers
        dispatch(
          pushAnswers({
            questionId: id,
            answers,
          })
        );
      }
    };
    getAnswers();
  }, []);

  return (
    <CardContent>
      <Stack gap={2} paddingBlock={2}>
        {Object.keys(answers).map((key) => {
          return <Answer {...answers[key]} key={key} />;
        })}
      </Stack>
    </CardContent>
  );
};

export default AnswersSection;
