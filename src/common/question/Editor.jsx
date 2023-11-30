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

const QuestionEditor = ({ questionId, open, setOpen }) => {
  const titleInputRef = useRef();
  const textareaRef = useRef();
  const { title, content } = useSelector((state) => state.questions.viewedQuestions[questionId]);
  const dispatch = useDispatch();
  const [alertType, setAlertType] = useState("success");
  const [openAlert, setOpenAlert] = useState(false);

  const handleEdit = () => {
    const newData = {
      title: titleInputRef.current.value,
      content: textareaRef.current.value,
    };
    const data = {
      questionId,
      ...newData,
    };
    // Send data to server
    // If Response = true
    // Save Question State
    dispatch(pushQuestion({ id: questionId, data: newData }));
    setAlertType("success");
    setOpen(false);

    // If Error
    // setAlertType("error")
    setOpenAlert(true);
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
                <InputBase inputRef={titleInputRef} defaultValue={title} placeholder="Choose a title" fullWidth />
              </Box>

              <Divider />
              {/* Text Area */}
              <Box mt={1} mb={2}>
                <InputBase
                  inputRef={textareaRef}
                  defaultValue={content}
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
