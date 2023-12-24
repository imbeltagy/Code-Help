import { Suspense, lazy, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { pushQuestion } from "/src/features/questions/questionsSlice";
const FullQuestion = lazy(() => import("/src/common/question/FullQuestion"));
import fetchApi from "/src/app/fetchApi/Index";

const SingleQuestionPage = () => {
  const [questionExist, setQuestionExist] = useState("loading");
  const { questionID } = useParams();
  const [id, setId] = useState(); // id: question date
  const dispatch = useDispatch();
  const isFetching = useSelector((state) => state.user.isFetching);

  // Fetch Question
  useEffect(() => {
    const getQuestions = async () => {
      // Res For Question
      const res = await fetchApi(
        `get_questions?question_id=${[questionID].join("&question_id=")}&current_user_username=none`,
        "GET"
      );
      if (res.success) {
        // Save Questions as a State
        const question = res.data[0];
        const date = new Date(question.publish_date).getTime();
        const questionData = {
          id: questionID,
          date,
          username: question.author_username,
          displayName: question.author_display_name,
          title: question.question_title,
          content: question.question_content,
          isSolved: question.is_solved,
          isSaved: false,
        };
        dispatch(pushQuestion(questionData));
        setId(date);
        setQuestionExist(true);
      }
    };
    !isFetching && questionID && getQuestions();
  }, [isFetching, questionID]);

  if (questionExist == "loading") return "loading...";

  if (questionExist)
    return (
      <Suspense>
        <Box pb={4}>{id ? <FullQuestion id={id} /> : null}</Box>
      </Suspense>
    );

  return "This question doesn't exist";
};

export default SingleQuestionPage;
