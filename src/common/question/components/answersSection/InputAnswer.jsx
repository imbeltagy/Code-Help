import { useTheme } from "@emotion/react";
import { Send } from "@mui/icons-material";
import { Alert, Box, IconButton, InputBase, Link, Stack } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { pushAnswers, modifyAnswer } from "/src/features/questions/questionsSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import fetchApi from "/src/app/fetchApi/Index";

const InputAnswer = ({ id }) => {
  const mode = useTheme().palette.mode;
  const { username: currentUser, displayName, isLogged } = useSelector((state) => state.user);
  const questionApiId = useSelector((state) => state.questions.savedQuestions[id]?.id);
  const inputRef = useRef();
  const [errorMsg, setErrorMsg] = useState();
  const [inputVal, setInputVal] = useState("");
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const dispatch = useDispatch();

  // Focus On Input on Mount
  useEffect(() => {
    isLogged && inputRef.current.focus();
  }, [isLogged]);

  const publishAnswer = useCallback(() => {
    // save Input value
    const content = inputRef.current.value;

    const sendAnswer = async () => {
      // Update The UI Till Calling API
      const answerId = new Date().getTime();
      // save Answer As Local State
      dispatch(
        pushAnswers({
          questionId: id,
          answers: { [answerId]: { username: currentUser, displayName, date: new Date().getTime(), content } },
        })
      );

      // Reset Input Value
      inputRef.current.value = "";

      // Push Answer To Server
      const res = await fetchApi("answer_question", "POST", {
        question_id: questionApiId,
        answer_author: currentUser,
        content,
      });

      if (res.success) {
        // Remove Error if Exist
        setErrorMsg(null);
        dispatch(modifyAnswer({ questionId: id, answerId, newData: { id: res.data.answer_id } }));
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
            inputRef={inputRef}
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
              inputRef.current.focus();
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
