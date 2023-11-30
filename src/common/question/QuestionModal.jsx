import { Box, Modal } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Question from "./Question";
import { closeModal } from "/src/features/questions/questionsSlice";

const QuestionModal = () => {
  const id = useSelector((state) => state.questions.modalId);
  const dispatch = useDispatch();

  return (
    <Modal open={Boolean(id)} onClose={() => dispatch(closeModal())}>
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
