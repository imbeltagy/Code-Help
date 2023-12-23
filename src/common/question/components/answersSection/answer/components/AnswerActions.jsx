import { DeleteOutlineOutlined, EditOutlined } from "@mui/icons-material";
import { IconButton, Stack } from "@mui/material";
import { removeAnswer } from "/src/features/questions/questionsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { open } from "/src/features/notification/notificationSlice";

const AnswerActions = ({ questionId, answerId }) => {
  const dispatch = useDispatch();
  const questionApiId = useSelector((state) => state.questions.savedQuestions[questionId].id);
  const answerApiId = useSelector((state) => state.questions.savedAnswers[questionId][answerId].id);

  console.log(questionApiId, answerApiId);

  const handleDelete = useCallback(() => {
    // Update UI Before Calling API
    dispatch(removeAnswer({ questionId, answerId }));

    // Unknown Error with axios request so I used fetch
    fetch("http://127.0.0.1:5000/remove_question_answer", {
      method: "DELETE",
      body: JSON.stringify({
        answer_id: answerApiId,
        question_id: questionApiId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(() => dispatch(open({ message: "Answer has been deleted successfuly.", type: "success" })))
      .catch(() => dispatch(open({ message: "Error on deleting the answer. please try again later.", type: "error" })));
  }, []);

  return (
    <IconButton color="error" onClick={() => handleDelete()}>
      <DeleteOutlineOutlined color="error" />
    </IconButton>
  );
};

export default AnswerActions;
