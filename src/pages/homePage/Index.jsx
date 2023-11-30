import { Stack } from "@mui/material";
import Question from "/src/common/question/Question";
import QuestionCreator from "/src/common/questionCreator/Index";

const postsIDs = ["123", "749", "196"];

const HomePage = () => {
  return (
    <>
      <QuestionCreator />

      {/* Questions */}
      <Stack pb={4} spacing={4}>
        {postsIDs.map((id) => (
          <Question id={id} key={id} />
        ))}
      </Stack>
    </>
  );
};

export default HomePage;
