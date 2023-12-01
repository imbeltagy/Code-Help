import { Add, Close } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Fab,
  IconButton,
  InputBase,
  Modal,
  Snackbar,
} from "@mui/material";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Signup2Action from "/src/common/signup2action/Index";

const QuestionCreator = () => {
  const { username, isLogged } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [openAlert, setOpenAlert] = useState(false);
  const navigate = useNavigate();
  const titleInputRef = useRef();
  const textareaRef = useRef();

  const handleOpen = () => {
    setOpen(true);
  };

  const handlePost = () => {
    const data = {
      username,
      title: titleInputRef.current.value,
      content: textareaRef.current.value,
    };
    // Send data to server
    // If Response = true
    // Save Question State
    setAlertType("success");
    setOpen(false);

    // If Error
    // setAlertType("error")
    setOpenAlert(true);
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
        <>
          {/* Modal */}
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

          {/* Alert */}
          <Snackbar open={openAlert} autoHideDuration={3000} onClose={() => setOpenAlert(false)}>
            <Alert onClose={() => setOpenAlert(false)} severity={alertType} sx={{ width: "100%" }}>
              {alertType == "success" ? "Qeustion edited successfuly" : null}
              {alertType == "error" ? "Error while edited question" : null}
            </Alert>
          </Snackbar>
        </>
      ) : (
        <Signup2Action text="ask a question" open={open} setOpen={setOpen} />
      )}
    </>
  );
};

export default QuestionCreator;
