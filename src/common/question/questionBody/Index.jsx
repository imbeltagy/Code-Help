import { CardContent, Chip, Typography } from "@mui/material";
import React, { Fragment } from "react";
import { useSelector } from "react-redux";

const QuestionBody = ({ id }) => {
  const { title, isSolved, content } = useSelector((state) => state.questions.savedQuestions[id]);

  return (
    <CardContent>
      <Typography mb={0.5} variant="h6" component="h2">
        {title}
      </Typography>
      <Chip
        label={isSolved ? "Solved" : "Not Solved"}
        color={isSolved ? "success" : "error"}
        sx={{ paddingInline: 0.75 }}
        size="small"
      />
      <Typography variant="body2" mt={2} color="text.secondary">
        {content?.split("\n").map((line, i) => (
          <Fragment key={i}>
            {i > 0 && <br />}
            {line}
          </Fragment>
        ))}
      </Typography>
    </CardContent>
  );
};

export default QuestionBody;
