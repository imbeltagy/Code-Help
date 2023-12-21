import { Stack } from "@mui/material";
import QuestionCreator from "/src/common/questionCreator/Index";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pushQuestion } from "/src/features/questions/questionsSlice";
import NoAnswersQuestion from "/src/common/question/NoAnswersQuestion";
import fetchApi from "/src/app/fetchApi/Index";

const HomePage = () => {
  const dispatch = useDispatch();
  const isFetching = useSelector((state) => state.user.isFetching);
  const [questionsIDs, setQuestionsIDs] = useState([]);

  // Fetch Questions
  useEffect(() => {
    // Get Data From API
    const getQuestions = async () => {
      // Get Latest Questions Count
      const { success: getQuestionsSuccess, data } = await fetchApi(`latest_questions?count=10`, "GET");
      if (getQuestionsSuccess) {
        // Save Questions as a State
        const IDs = [];
        data.forEach(({ id, author_username: username, title, content, publish_date, solved_state: isSolved }) => {
          const questionData = {
            id,
            username,
            displayName: username,
            title,
            content,
            date: new Date(publish_date).getTime(),
            isSolved,
            isSaved: false,
          };
          IDs.push(id);
          dispatch(pushQuestion({ id, data: questionData }));
        });
        setQuestionsIDs(IDs);
      }
    };
    !isFetching && getQuestions();
  }, [isFetching]);

  return (
    <>
      <QuestionCreator />

      {/* Questions */}
      {questionsIDs.length == 0 ? (
        "Loading..."
      ) : (
        <Stack pb={4} spacing={4}>
          {questionsIDs.map((id) => (
            <NoAnswersQuestion id={id} key={id} />
          ))}
        </Stack>
      )}
    </>
  );
};

export default HomePage;
