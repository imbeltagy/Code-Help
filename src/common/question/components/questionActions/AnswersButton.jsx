import { IconButton, Tooltip } from "@mui/material";
import { Chat, Close } from "@mui/icons-material";
import { useRef, useState } from "react";
import QuestionModal from "/src/common/question/QuestionModal";

const AnswersButton = ({ id }) => {
  const [open, setOpen] = useState(false);
  const answersSectionRef = useRef();

  return (
    <>
      {/* Button */}
      <Tooltip describeChild title="Write An Answer">
        <IconButton
          onClick={() => {
            setOpen(true);
            answersSectionRef?.current?.focus();
          }}
        >
          <Chat />
        </IconButton>
      </Tooltip>

      {/* Modal */}
      <QuestionModal id={id} open={open} setOpen={setOpen} />
    </>
  );
};

export default AnswersButton;
