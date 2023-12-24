import { Stack } from "@mui/material";
import QuestionCreator from "/src/common/questionCreator/Index";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pushQuestion } from "/src/features/questions/questionsSlice";
import NoAnswersQuestion from "/src/common/question/NoAnswersQuestion";
import fetchApi from "/src/app/fetchApi/Index";

const HomePage = () => {
  const dispatch = useDispatch();
  const isFetching = useSelector((state) => state.user.isFetching);
  const questionsKeys = useSelector((state) => state.questions.keys);

  // Fetch Questions
  useEffect(() => {
    // Get Data From API
    const getQuestions = async () => {
      // Get Latest Questions Count
      // No time to load more question on scroll
      const { success: getQuestionsSuccess, data } = await fetchApi(`latest_questions?count=50`, "GET");
      if (getQuestionsSuccess) {
        // Save Questions as a State
        data.forEach(
          ({ id, author_username, author_displayname, title, content, publish_date, solved_state, is_saved }) => {
            const questionData = {
              id,
              username: author_username,
              displayName: author_displayname,
              title,
              content,
              date: new Date(publish_date).getTime(),
              isSolved: solved_state,
              isSaved: is_saved,
            };
            dispatch(pushQuestion(questionData));
          }
        );
      }
    };
    !isFetching && getQuestions();
  }, [isFetching]);

  return (
    <>
      <QuestionCreator />

      {/* Questions */}
      {questionsKeys.length == 0 ? (
        "Loading..."
      ) : (
        <Stack pb={4} spacing={4}>
          {questionsKeys.map((id, i) => (
            <NoAnswersQuestion id={id} key={i} />
          ))}
        </Stack>
      )}
    </>
  );
};

export default HomePage;
