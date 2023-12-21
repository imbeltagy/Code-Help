import { Close } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  InputBase,
  Modal,
  Snackbar,
} from "@mui/material";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pushQuestion } from "/src/features/questions/questionsSlice";
import fetchApi from "/src/app/fetchApi/Index";

const QuestionEditor = ({ id, open, setOpen }) => {
  const titleInputRef = useRef();
  const textareaRef = useRef();
  const savedQuestion = useSelector((state) => state.questions.savedQuestions[id]);
  const dispatch = useDispatch();
  const [alertType, setAlertType] = useState("success");
  const [openAlert, setOpenAlert] = useState(false);

  const handleEdit = () => {
    const newData = {
      question_id: id,
      new_title: titleInputRef.current.value,
      new_content: textareaRef.current.value,
      new_solved_state: savedQuestion.isSolved | false,
    };
    // Send data to server
    const sendData = async () => {
      const res = await fetchApi("edit_question", "PUT", newData);
      if (res.success) {
        // Save Question State
        dispatch(
          pushQuestion({ id, data: { ...savedQuestion, title: newData.new_title, content: newData.new_content } })
        );
        setAlertType("success");
        setOpen(false);
      } else {
        setAlertType("error");
        setOpenAlert(true);
      }
    };
    (newData.new_title != savedQuestion.title || newData.new_content != savedQuestion.content) && sendData();
  };

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            width: "min(70rem, 100%)",
            position: "absolute",
            inset: "50% 0 0 50%",
            transform: "translate(-50%, -50%)",
            paddingInline: 0.5,
          }}
        >
          <Card>
            <CardHeader
              action={
                <IconButton aria-label="Close" onClick={() => setOpen(false)}>
                  <Close />
                </IconButton>
              }
              title="Ask a question"
              titleTypographyProps={{ textAlign: "center" }}
            />
            <Divider />
            <CardContent>
              {/* Title */}
              <Box mb={1}>
                <InputBase
                  inputRef={titleInputRef}
                  defaultValue={savedQuestion.title}
                  placeholder="Choose a title"
                  fullWidth
                />
              </Box>

              <Divider />
              {/* Text Area */}
              <Box mt={1} mb={2}>
                <InputBase
                  inputRef={textareaRef}
                  defaultValue={savedQuestion.content}
                  placeholder="Write your question..."
                  fullWidth
                  minRows={3}
                  maxRows={20}
                  multiline
                />
                <Divider />
              </Box>

              {/* Edit Button */}
              <Button onClick={handleEdit} variant="contained" fullWidth>
                Edit
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Modal>

      {/* Alert */}
      <Snackbar open={openAlert} autoHideDuration={3000} onClose={() => setOpenAlert(false)}>
        <Alert onClose={() => setOpenAlert(false)} severity={alertType} sx={{ width: "100%" }}>
          {alertType == "success" ? "Qeustion edited successfuly" : null}
          {alertType == "error" ? "Error while edited question" : null}
        </Alert>
      </Snackbar>
    </>
  );
};

export default QuestionEditor;
