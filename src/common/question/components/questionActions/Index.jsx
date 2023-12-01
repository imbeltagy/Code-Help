import { CardActions } from "@mui/material";
import { Suspense, lazy } from "react";
import SaveButton from "./SaveButton";
import CopyLink from "./CopyLink";
const AnswersButton = lazy(() => import("./AnswersButton"));

const QuestionActions = ({ id, disableModal }) => {
  return (
    <CardActions disableSpacing>
      <SaveButton id={id} />

      <CopyLink id={id} />

      {!disableModal ? (
        <Suspense>
          {/* Suspense to not render the element if not needed */}
          <AnswersButton id={id} />
        </Suspense>
      ) : null}
    </CardActions>
  );
};

export default QuestionActions;
