import { useTheme } from "@emotion/react";
import { Send } from "@mui/icons-material";
import { Alert, Box, IconButton, InputBase, Link, Stack } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { pushAnswers } from "/src/features/questions/questionsSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import fetchApi from "/src/app/fetchApi/Index";

const InputAnswer = ({ id }) => {
  const dispatch = useDispatch();
  const mode = useTheme().palette.mode;
  const [inputVal, setInputVal] = useState("");
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const ref = useRef();
  const { username: currentUser, displayName, isLogged } = useSelector((state) => state.user);
  const [errorMsg, setErrorMsg] = useState();

  // Focus On Input on Mount
  useEffect(() => {
    isLogged && ref.current.focus();
  }, [isLogged]);

  const publishAnswer = useCallback(() => {
    // save Input value
    const content = ref.current.value;

    const sendAnswer = async () => {
      // Update The UI Till Calling API
      // Generate temp ID for the answer till getting it again from server
      const tempID = Math.random();

      // save Answer As Local State
      dispatch(
        pushAnswers({
          questionId: id,
          answers: { [tempID]: { username: currentUser, displayName, date: new Date().getTime(), content } },
        })
      );

      // Reset Input Value
      ref.current.value = "";

      // Push Answer To Server
      const res = await fetchApi("answer_question", "POST", {
        question_id: id,
        answer_author: currentUser,
        content,
      });

      if (res.success) {
        // Remove Error if Exist
        setErrorMsg(null);
      } else {
        // Set Error Message
        setErrorMsg(
          "Error with sending answer. Check your connections and try again.\nIf this error keeps happen please contact us."
        );
      }
    };
    content != "" && sendAnswer();
  }, []);

  if (errorMsg) return <Alert severity="error">{errorMsg}</Alert>;

  return (
    <Stack
      alignItems="center"
      paddingBlock={1}
      paddingInline={2}
      bgcolor={mode === "light" ? "grey.200" : "#333"}
      direction="row"
      mt={1}
    >
      {isLogged ? (
        <>
          <InputBase
            inputRef={ref}
            multiline
            maxRows={3}
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
        </>
      ) : (
        <Box p={1}>
          You need to{" "}
          <Link fontWeight="600" underline="none" component={RouterLink} to="/signup">
            sign up
          </Link>{" "}
          to answer.
        </Box>
      )}
    </Stack>
  );
};

export default InputAnswer;
