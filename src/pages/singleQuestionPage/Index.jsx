import { Suspense, lazy, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { pushQuestion } from "/src/features/questions/questionsSlice";
const FullQuestion = lazy(() => import("/src/common/question/FullQuestion"));

// Temp API Data
const questions = {
  123: {
    avatar: "",
    username: "user1",
    displayName: "3mmar Khalid",
    date: "1701463130358",
    title: "My Question",
    content:
      "Whip up a quick and healthy vegetarian stir-fry featuring colorful veggies and tofu. It's a nutritious option for a busy weeknight dinner.",
    isSolved: true,
    isSaved: true,
  },
  749: {
    avatar: "",
    username: "beltagy",
    displayName: "Mohammed Beltagy",
    date: 1700403130358,
    title: "Problem with this code.",
    content:
      "This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like.",
    isSolved: false,
    isSaved: false,
  },
  196: {
    avatar: "",
    username: "yseer",
    displayName: "Yasser Bro",
    date: 1701453130358,
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
      <Suspense>
        <Box pb={4}>
          <FullQuestion id={questionID} />
        </Box>
      </Suspense>
    );

  return "This question doesn't exist";
};

export default SingleQuestionPage;
