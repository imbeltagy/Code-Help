import { Box, Modal } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Question from "./Question";
import { close } from "/src/features/questionModal/questionModalSlice";

const QuestionModal = () => {
  const id = useSelector((state) => state.questionModal.questionId);
  const dispatch = useDispatch();

  return (
    <Modal open={Boolean(id)} onClose={() => dispatch(close())}>
      <Box
        sx={{
          width: "min(70rem, 100%)",
          height: "calc(100% - 10rem)",
          marginBlock: 10,
          marginInline: "auto",
          paddingInline: 0.5,
        }}
      >
        <Question id={id} modal />
      </Box>
    </Modal>
  );
};

export default QuestionModal;
