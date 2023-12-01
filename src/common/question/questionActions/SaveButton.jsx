import { Alert, IconButton, Snackbar, Tooltip } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeSavedState } from "/src/features/questions/questionsSlice";
import { Bookmark } from "@mui/icons-material";

const SaveButton = ({ id }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [sucessState, setSucessState] = useState();
  const isSaved = useSelector((state) => state.questions.savedQuestions[id].isSaved);

  const handleClick = () => {
    dispatch(changeSavedState({ id, state: !isSaved }));

    // Send Data To API
    setTimeout(() => {
      setSucessState(true);
      setOpen(true);
    }, 200);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <Tooltip describeChild title="Save Question">
        <IconButton onClick={handleClick} color={isSaved ? "primary" : ""}>
          <Bookmark />
        </IconButton>
      </Tooltip>

      {/* Alert On Save */}
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={sucessState ? "success" : "error"} sx={{ width: "100%" }}>
          {sucessState
            ? isSaved
              ? "Saved the question succesfuly!"
              : "Unsaved the question succesfuly!"
            : isSaved
            ? "Error while saving question!"
            : "Error while ussaving question!"}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SaveButton;
