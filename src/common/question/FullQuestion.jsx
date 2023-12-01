import { Card, Divider } from "@mui/material";
import QuestionHeader from "./components/questionHeader/Index";
import QuestionBody from "./components/questionBody/Index";
import QuestionActions from "./components/questionActions/Index";
import AnswersSection from "./components/answersSection/Index";
import InputAnswer from "./components/answersSection/InputAnswer";

const FullQuestion = ({ id }) => {
  return (
    <Card>
      <QuestionHeader id={id} />

      <QuestionBody id={id} />

      <QuestionActions id={id} disableModal />

      <Divider />

      <AnswersSection id={id} />

      <InputAnswer id={id} />
    </Card>
  );
};

export default FullQuestion;
