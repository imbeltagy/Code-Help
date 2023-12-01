import { Box, Card, Divider, IconButton, Modal } from "@mui/material";
import QuestionHeader from "./components/questionHeader/Index";
import QuestionBody from "./components/questionBody/Index";
import QuestionActions from "./components/questionActions/Index";
import AnswersSection from "./components/answersSection/Index";
import InputAnswer from "./components/answersSection/InputAnswer";
import { Close } from "@mui/icons-material";

const QuestionModal = ({ id, open, setOpen }) => {
  const CloseButton = () => (
    <IconButton onClick={() => setOpen(false)} aria-label="Close Question">
      <Close />
    </IconButton>
  );

  return (
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
  );
};

export default QuestionModal;
