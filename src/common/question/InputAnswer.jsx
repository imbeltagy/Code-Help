import { useTheme } from "@emotion/react";
import { Send } from "@mui/icons-material";
import { FormControl, IconButton, Stack } from "@mui/material";
import React, { forwardRef, useCallback, useEffect, useState } from "react";
import { pushAnswers } from "/src/features/viewedQuestions/viewedQuestionsSlice";
import { useDispatch } from "react-redux";

const InputAnswer = forwardRef(({ id }, ref) => {
  const dispatch = useDispatch();
  const mode = useTheme().palette.mode;
  const [inputVal, setInputVal] = useState("");
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  let formControlRows = inputVal.split("\n").length;

  // Focus On Input on Mount
  useEffect(() => {
    ref.current.focus();
  }, []);

  const publishAnswer = useCallback(() => {
    const tempID = Math.random();
    dispatch(pushAnswers({ id, data: { [tempID]: { username: "me", content: ref.current.value } } }));
    ref.current.value = "";
    // Send Answer To API
  }, []);

  return (
    <Stack
      alignItems="center"
      paddingBlock={1}
      paddingInline={2}
      bgcolor={mode === "light" ? "grey.200" : "#333"}
      direction="row"
      mt={1}
    >
      <FormControl
        rows={formControlRows <= 3 ? formControlRows : 3}
        component="textarea"
        ref={ref}
        onChange={(e) => setInputVal(e.target.value)}
        onKeyDown={(e) => {
          e.key === "Shift" && setIsShiftPressed(true);
          if (e.key === "Enter" && inputVal && !isShiftPressed) {
            publishAnswer();
            e.preventDefault();
          }
        }}
        onKeyUp={(e) => {
          e.key === "Shift" && setIsShiftPressed(false);
        }}
        sx={{ flexGrow: 1, backgroundColor: "transparent", outline: "none", resize: "none" }}
        placeholder="Write an answer..."
      />
      <IconButton
        disabled={!inputVal}
        onClick={() => {
          publishAnswer();
          ref.current.focus();
        }}
      >
        <Send />
      </IconButton>
    </Stack>
  );
});

export default InputAnswer;
