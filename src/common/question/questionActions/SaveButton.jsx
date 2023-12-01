import { Alert, IconButton, Snackbar, Tooltip } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeSavedState } from "/src/features/questions/questionsSlice";
import { Bookmark } from "@mui/icons-material";
import Signup2Action from "/src/common/signup2action/Index";

const SaveButton = ({ id }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [sucessState, setSucessState] = useState();
  const isSaved = useSelector((state) => state.questions.savedQuestions[id].isSaved);
  const isLogged = useSelector((state) => state.user.isLogged);

  const handleClick = () => {
    if (isLogged) {
      dispatch(changeSavedState({ id, state: !isSaved }));

      // Send Data To API
      setTimeout(() => {
        setSucessState(true);
        setOpen(true);
      }, 200);
    } else {
      setOpen(true);
    }
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
        <IconButton onClick={handleClick} color={isSaved && isLogged ? "primary" : ""}>
          <Bookmark />
        </IconButton>
      </Tooltip>

      {/* Alert On Save */}
      {isLogged ? (
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
      ) : (
        <Signup2Action text="save questions" open={open} setOpen={setOpen} />
      )}
    </>
  );
};

export default SaveButton;
