import { Card } from "@mui/material";
import QuestionHeader from "./components/questionHeader/Index";
import QuestionBody from "./components/questionBody/Index";
import QuestionActions from "./components/questionActions/Index";

const NoAnswersQuestion = ({ id }) => {
  return (
    <Card key={id}>
      <QuestionHeader id={id} />

      <QuestionBody id={id} />

      <QuestionActions id={id} />
    </Card>
  );
};

export default NoAnswersQuestion;
