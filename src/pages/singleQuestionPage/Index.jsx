import React from "react";
import { useParams } from "react-router-dom";
import Question from "/src/common/question/Question";
import { Box } from "@mui/material";

const postsIDs = ["123", "749", "196"];

const SingleQuestionPage = () => {
  const { questionID } = useParams();

  if (postsIDs.includes(questionID))
    return (
      <Box pb={4}>
        <Question id={questionID} displayAnswers />
      </Box>
    );

  return "This question doesn't exist";
};

export default SingleQuestionPage;
