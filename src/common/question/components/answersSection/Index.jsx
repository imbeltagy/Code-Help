import { Alert, CardContent, Stack } from "@mui/material";
import Answer from "./answer/Index";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pushAnswers } from "/src/features/questions/questionsSlice";
import fetchApi from "/src/app/fetchApi/Index";

const AnswersSection = ({ id }) => {
  const dispatch = useDispatch();
  const answers = useSelector((state) => state.questions.savedAnswers[id]) || {};
  const [noAnswersMsg, setNoAnswersMsg] = useState("Loading...");
  const [errorMsg, setErrorMsg] = useState();

  // Request Data From API
  useEffect(() => {
    const getAnswers = async () => {
      const res = await fetchApi(`get_question_answers?question_id=${id}`, "GET");
      if (res.success) {
        // init and object to get answers
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

        // If there is no answers
        Object.keys(answers).length == 0 && setNoAnswersMsg("No answers yet.");

        // Remove Error if exist
        setErrorMsg(null);
      } else {
        // error message
        setErrorMsg("Error fetching data. Please check your connection try again.");
      }
    };
    getAnswers();
  }, []);

  return (
    <CardContent>
      <Stack gap={2} paddingBlock={2}>
        {errorMsg ? <Alert severity="error">{errorMsg}</Alert> : null}
        {Object.keys(answers).length == 0 && !errorMsg ? noAnswersMsg : null}
        {Object.keys(answers).map((key) => {
          return <Answer {...answers[key]} questionId={id} answerId={key} key={key} />;
        })}
      </Stack>
    </CardContent>
  );
};

export default AnswersSection;
