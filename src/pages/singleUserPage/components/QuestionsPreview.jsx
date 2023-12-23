import { Card, CardContent, Grid, Typography, Chip, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import fetchApi from "/src/app/fetchApi/Index";

const QuestionsPreview = ({ headding, questionsIds, isFetching }) => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const getQuestions = async () => {
      const ids = questionsIds;
      const res = await fetchApi(
        `get_questions?question_id=${ids.join("&question_id=")}&current_user_username=none`,
        "GET"
      );
      if (res.success) {
        setQuestions(
          res.data.map((item, i) => ({
            id: ids[i],
            title: item.question_title,
            content: item.question_content,
            isSolved: item.is_solved,
          }))
        );
      }
    };
    !isFetching && questionsIds.length > 0 && getQuestions();
  }, [questionsIds]);

  if (questions.length > 0)
    return (
      <Box marginBlock={6} width="100%">
        <Typography mb="1rem" fontWeight="500" variant="h5" component="h2">
          {headding}
        </Typography>
        <Grid container spacing={2}>
          {questions.map(({ id, title, content, isSolved }, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <Link to={`/question/${id}`} style={{ textDecoration: "none" }}>
                <Card>
                  <CardContent>
                    <Typography mb=".5rem" variant="h5" fontWeight="700" component="h3">
                      {title}
                    </Typography>
                    <Chip
                      label={isSolved ? "Solved" : "Not Solved"}
                      color={isSolved ? "success" : "error"}
                      sx={{ paddingInline: 0.75 }}
                      size="small"
                    />

                    <Typography
                      mt=".8rem"
                      sx={{
                        display: "-webkit-box",
                        "-webkit-line-clamp": "2",
                        "-webkit-box-orient": "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {content}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
};

export default QuestionsPreview;
