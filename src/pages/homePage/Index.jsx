import { Card, Stack } from "@mui/material";
import QuestionCreator from "/src/common/questionCreator/Index";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { pushQuestion } from "/src/features/questions/questionsSlice";
import QuestionBody from "/src/common/question/questionBody/Index";
import QuestionActions from "/src/common/question/questionActions/Index";
import QuestionHeader from "/src/common/question/questionHeader/Index";

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

const HomePage = () => {
  const dispatch = useDispatch();
  const [questionsIDs, setQuestionsIDs] = useState([]);

  // Fetch Questions
  useEffect(() => {
    // Get Data From API
    //
    // Save Questions as a State
    const IDs = Object.keys(questions);
    IDs.forEach((id) => {
      dispatch(pushQuestion({ id, data: questions[id] }));
    });
    setQuestionsIDs(IDs);
  }, []);

  return (
    <>
      <QuestionCreator />

      {/* Questions */}
      <Stack pb={4} spacing={4}>
        {questionsIDs.map((id) => (
          <Card key={id}>
            <QuestionHeader id={id} />

            <QuestionBody id={id} />

            <QuestionActions id={id} />
          </Card>
        ))}
      </Stack>
    </>
  );
};

export default HomePage;
