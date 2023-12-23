import { Close } from "@mui/icons-material";
import { Box, Button, Card, CardContent, CardHeader, Divider, IconButton, InputBase, Modal } from "@mui/material";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pushQuestion } from "/src/features/questions/questionsSlice";
import fetchApi from "/src/app/fetchApi/Index";
import { open as openNotification } from "/src/features/notification/notificationSlice";

const QuestionEditor = ({ id, open, setOpen }) => {
  const titleInputRef = useRef();
  const textareaRef = useRef();
  const savedQuestion = useSelector((state) => state.questions.savedQuestions[id]);
  const dispatch = useDispatch();

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

        // Open Success Notification
        dispatch(openNotification({ message: "Qeustion edited successfuly.", type: "success" }));
        setOpen(false);
      } else {
        // Open Error Notification
        dispatch(
          openNotification({ message: "An error happend. Please try again after a few minutes.", type: "error" })
        );
      }
    };
    (newData.new_title != savedQuestion.title || newData.new_content != savedQuestion.content) && sendData();
  };

  return (
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
  );
};

export default QuestionEditor;
