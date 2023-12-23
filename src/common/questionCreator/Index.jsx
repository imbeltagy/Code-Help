import { Add, Close } from "@mui/icons-material";
import { Box, Button, Card, CardContent, CardHeader, Divider, Fab, IconButton, InputBase, Modal } from "@mui/material";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Signup2Action from "/src/common/signup2action/Index";
import fetchApi from "/src/app/fetchApi/Index";
import { open as openNotification } from "/src/features/notification/notificationSlice";
import { pushQuestion, removeQuestion, replaceQuestionId } from "/src/features/questions/questionsSlice";

const QuestionCreator = () => {
  const { username, displayName, isLogged } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const titleInputRef = useRef();
  const textareaRef = useRef();
  const dispatch = useDispatch();

  const handleOpen = () => {
    setOpen(true);
  };

  const handlePost = async () => {
    const data = {
      author_username: username,
      title: titleInputRef.current.value,
      content: textareaRef.current.value,
    };
    // Update The UI Till Calling API
    // Generate temp ID for the answer till getting it again from server
    const tempID = Math.random();

    // save Answer As Local State
    dispatch(
      pushQuestion({
        id: tempID,
        data: {
          username,
          displayName,
          date: new Date().getTime(),
          title: data.title,
          content: data.content,
          isSolved: false,
          isSaved: false,
        },
      })
    );

    // Send data to server
    const res = await fetchApi("new_question", "POST", data);

    if (res.success) {
      dispatch(openNotification({ message: "Qeustion created successfuly.", type: "success" }));
      setOpen(false);
      // Save Question State
      dispatch(replaceQuestionId({ oldId: tempID, newId: res.data.question_id }));
    } else {
      dispatch(openNotification({ message: "An error happend. Please try again after a few minutes.", type: "error" }));
      // Remove The Temp Question
      dispatch(removeQuestion(tempID));
    }
  };

  return (
    <>
      {/* Button */}
      <Box position="fixed" bottom="2rem" left="1rem">
        <Fab color="primary" aria-label="create new question" onClick={handleOpen}>
          <Add />
        </Fab>
      </Box>
      {isLogged ? (
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
                  <InputBase inputRef={titleInputRef} placeholder="Choose a title" fullWidth />
                </Box>

                <Divider />
                {/* Text Area */}
                <Box mt={1} mb={2}>
                  <InputBase
                    inputRef={textareaRef}
                    placeholder="Write your question..."
                    fullWidth
                    minRows={3}
                    maxRows={20}
                    multiline
                  />
                  <Divider />
                </Box>

                {/* Post Button */}
                <Button onClick={handlePost} variant="contained" fullWidth>
                  Post
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Modal>
      ) : (
        <Signup2Action text="ask a question" open={open} setOpen={setOpen} />
      )}
    </>
  );
};

export default QuestionCreator;
