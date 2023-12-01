import { Box, Card, Divider, IconButton, Modal, Tooltip } from "@mui/material";
import { Chat, Close } from "@mui/icons-material";
import { useRef, useState } from "react";
import QuestionHeader from "/src/common/question/questionHeader/Index";
import QuestionBody from "/src/common/question/questionBody/Index";
import QuestionActions from "./Index";
import AnswersSection from "/src/common/question/answerSection/Index";
import InputAnswer from "/src/common/question/answerSection/InputAnswer";

const AnswersButton = ({ id }) => {
  const [open, setOpen] = useState(false);
  const answersSectionRef = useRef();

  const CloseButton = () => (
    <IconButton onClick={() => setOpen(false)} aria-label="Close Question">
      <Close />
    </IconButton>
  );

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
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            width: "min(70rem, 100%)",
            height: "calc(100% - 10rem)",
            marginBlock: 10,
            marginInline: "auto",
            paddingInline: 0.5,
          }}
        >
          <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <QuestionHeader id={id} moreActions={[<CloseButton />]} />

            <Box flexGrow={1} overflow="auto">
              <QuestionBody id={id} />

              <QuestionActions id={id} disableModal />

              <Divider />

              <AnswersSection id={id} />
            </Box>

            <InputAnswer id={id} />
          </Card>
        </Box>
      </Modal>
    </>
  );
};

export default AnswersButton;
