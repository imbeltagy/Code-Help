import { IconButton, Tooltip } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeSavedState } from "/src/features/questions/questionsSlice";
import { Bookmark } from "@mui/icons-material";
import Signup2Action from "/src/common/signup2action/Index";
import { open as openNotification } from "/src/features/notification/notificationSlice";

const SaveButton = ({ id }) => {
  const dispatch = useDispatch();
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const isSaved = useSelector((state) => state.questions.savedQuestions[id].isSaved);
  const isLogged = useSelector((state) => state.user.isLogged);

  const handleSave = () => {
    if (isLogged) {
      // Update UI till API response
      dispatch(changeSavedState({ id, state: !isSaved }));

      // Send Data To API
      setTimeout(() => {
        const res = { success: true };
        if (res.success) {
          // Open Sucess Notification
          const message = isSaved ? "Unsaved the question succesfuly!" : "Saved the question succesfuly!";
          dispatch(openNotification({ message, type: "success" }));
        } else {
          // Open Error Notification
          const message = isSaved ? "Error while ussaving question!" : "Error while saving question!";
          dispatch(openNotification({ message, type: "error" }));
          // Remove Saved State
          dispatch(changeSavedState({ id, state: false }));
        }
      }, 200);
    } else {
      setIsSignupModalOpen(true);
    }
  };

  return (
    <>
      <Tooltip describeChild title="Save Question">
        <IconButton onClick={handleSave} color={isSaved && isLogged ? "primary" : ""}>
          <Bookmark />
        </IconButton>
      </Tooltip>

      {/* Alert On Save */}
      {!isLogged ? (
        <Signup2Action text="save questions" open={isSignupModalOpen} setOpen={setIsSignupModalOpen} />
      ) : null}
    </>
  );
};

export default SaveButton;
