import { IconButton, Tooltip } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeSavedState } from "/src/features/questions/questionsSlice";
import { Bookmark } from "@mui/icons-material";
import Signup2Action from "/src/common/signup2action/Index";
import { open as openNotification } from "/src/features/notification/notificationSlice";
import fetchApi from "/src/app/fetchApi/Index";

const SaveButton = ({ id }) => {
  const dispatch = useDispatch();
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const { id: questionApiId, isSaved } = useSelector((state) => state.questions.savedQuestions[id]);
  const { username, isLogged } = useSelector((state) => state.user);

  const handleSave = () => {
    if (isLogged) {
      // Update UI till API response
      dispatch(changeSavedState({ id, newState: !isSaved }));

      // Send Data To API
      const callAPI = async () => {
        if (isSaved) {
          // Unsave
          const res = await fetchApi("unsave_question", "PATCH", { username, question_id: questionApiId });
          if (res.success) {
            dispatch(openNotification({ message: "Unsaved the question succesfuly!", type: "success" }));
          } else {
            dispatch(openNotification({ message: "Error while ussaving question!", type: "error" }));
            // Reset Saved State
            dispatch(changeSavedState({ id, newState: true }));
          }
        } else {
          // Save
          const res = await fetchApi("save_question", "PATCH", { username, question_id: questionApiId });
          if (res.success) {
            dispatch(openNotification({ message: "Saved the question succesfuly!", type: "success" }));
          } else {
            dispatch(openNotification({ message: "Error while saving question!", type: "error" }));
            // Reset Saved State
            dispatch(changeSavedState({ id, newState: false }));
          }
        }
      };
      callAPI();
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
