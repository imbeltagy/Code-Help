import { useTheme } from "@emotion/react";
import { Send } from "@mui/icons-material";
import { Box, IconButton, InputBase, Link, Stack } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { pushAnswers } from "/src/features/questions/questionsSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";

const InputAnswer = ({ id }) => {
  const dispatch = useDispatch();
  const mode = useTheme().palette.mode;
  const [inputVal, setInputVal] = useState("");
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const ref = useRef();
  const { username: currentUser, isLogged } = useSelector((state) => state.user);

  // Focus On Input on Mount
  useEffect(() => {
    isLogged && ref.current.focus();
  }, [isLogged]);

  const publishAnswer = useCallback(() => {
    const tempID = Math.random();
    dispatch(pushAnswers({ id, data: { [tempID]: { username: currentUser, content: ref.current.value } } }));
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
