import { DeleteOutlineOutlined, EditOutlined } from "@mui/icons-material";
import { IconButton, Stack } from "@mui/material";
import { removeAnswer } from "/src/features/questions/questionsSlice";
import { useDispatch } from "react-redux";

const AnswerActions = ({ questionId, answerId }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    const deleteAnswer = async () => {
      // Update UI Before Calling API
      dispatch(removeAnswer({ questionId, answerId }));

      // Unknown Error with axios request so I used fetch
      fetch("http://127.0.0.1:5000/remove_question_answer", {
        method: "DELETE",
        body: JSON.stringify({
          answer_id: answerId,
          question_id: questionId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          // Success Notification
        })
        .catch((err) => {
          //Error Notification
        });
    };
    deleteAnswer();
  };

  return (
    <Stack justifyContent="center">
      <IconButton color="primary" sx={{ p: 0, mb: ".5rem" }}>
        <EditOutlined color="primary" />
      </IconButton>
      <IconButton color="error" sx={{ p: 0 }} onClick={() => handleDelete()}>
        <DeleteOutlineOutlined color="error" />
      </IconButton>
    </Stack>
  );
};

export default AnswerActions;
