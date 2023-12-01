import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Card, Divider } from "@mui/material";
import QuestionHeader from "/src/common/question/questionHeader/Index";
import QuestionBody from "/src/common/question/questionBody/Index";
import QuestionActions from "/src/common/question/questionActions/Index";
import AnswersSection from "/src/common/question/answerSection/Index";
import InputAnswer from "/src/common/question/answerSection/InputAnswer";
import { useDispatch } from "react-redux";
import { pushQuestion } from "/src/features/questions/questionsSlice";

// Temp API Data
const questions = {
  123: {
    avatar: "",
    username: "user1",
    displayName: "Vegetarian Stir-Fry with Tofu",
    date: "May 8, 2018",
    title: "My Question",
    content:
      "Whip up a quick and healthy vegetarian stir-fry featuring colorful veggies and tofu. It's a nutritious option for a busy weeknight dinner.",
    isSolved: true,
    isSaved: true,
  },
  749: {
    avatar: "",
    username: "beltagy",
    displayName: "Shrimp and Chorizo Paella",
    date: "September 14, 2016",
    title: "Problem with this code.",
    content:
      "This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like.",
    isSolved: false,
    isSaved: false,
  },
  196: {
    avatar: "",
    username: "yseer",
    displayName: "Grilled Salmon with Lemon-Herb Marinade",
    date: "February 22, 2017",
    title: "My device gonna die.",
    content:
      "Enjoy the rich flavors of grilled salmon with a zesty lemon-herb marinade. It's a delightful dish for a cozy dinner with loved ones.",
    isSolved: false,
    isSaved: true,
  },
};
const SingleQuestionPage = () => {
  const [questionExist, setQuestionExist] = useState("loading");
  const { questionID } = useParams();
  const dispatch = useDispatch();

  // Fetch Questions
  useEffect(() => {
    // Get Data From API
    //
    const IDs = Object.keys(questions);
    const exist = IDs.includes(questionID);
    setQuestionExist(exist);
    // Save Questions as a State
    exist && dispatch(pushQuestion({ id: questionID, data: questions[questionID] }));
  }, []);

  if (questionExist == "loading") return "loading...";

  if (questionExist)
    return (
      <Box pb={4}>
        <Card>
          <QuestionHeader id={questionID} />

          <QuestionBody id={questionID} />

          <QuestionActions id={questionID} disableModal />

          <Divider />

          <AnswersSection id={questionID} />

          <InputAnswer id={questionID} />
        </Card>
      </Box>
    );

  return "This question doesn't exist";
};

export default SingleQuestionPage;
