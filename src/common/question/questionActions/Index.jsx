import { CardActions } from "@mui/material";
import React from "react";
import SaveButton from "./SaveButton";
import CopyLink from "./CopyLink";
import AnswersButton from "./AnswersButton";

const QuestionActions = ({ id, disableModal }) => {
  return (
    <CardActions disableSpacing>
      <SaveButton id={id} />

      <CopyLink id={id} />

      {!disableModal ? <AnswersButton id={id} /> : null}
    </CardActions>
  );
};

export default QuestionActions;
