import { Fragment, useCallback, useEffect, useRef } from "react";
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { Chat, Close, MoreVert } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { openModal, closeModal, pushQuestion } from "/src/features/questions/questionsSlice";
import AnswersSection from "./AnswersSection";
import { Link } from "react-router-dom";
import InputAnswer from "./InputAnswer";
import CopyLink from "./CopyLink";
import SaveButton from "./SaveButton";
import AuthorOptions from "./AuthorOptions";

// Temp API Data
const posts = {
  123: {
    avatar: "",
    username: "user1",
    displayName: "Vegetarian Stir-Fry with Tofu",
    date: "May 8, 2018",
    title: "My Question",
    content:
      "Whip up a quick and healthy vegetarian stir-fry featuring colorful veggies and tofu. It's a nutritious option for a busy weeknight dinner.",
    isSolved: true,
    isSaved: true,
  },
  749: {
    avatar: "",
    username: "beltagy",
    displayName: "Shrimp and Chorizo Paella",
    date: "September 14, 2016",
    title: "Problem with this code.",
    content:
      "This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like.",
    isSolved: false,
    isSaved: false,
  },
  196: {
    avatar: "",
    username: "yseer",
    displayName: "Grilled Salmon with Lemon-Herb Marinade",
    date: "February 22, 2017",
    title: "My device gonna die.",
    content:
      "Enjoy the rich flavors of grilled salmon with a zesty lemon-herb marinade. It's a delightful dish for a cozy dinner with loved ones.",
    isSolved: false,
    isSaved: true,
  },
};

const Question = ({ id, modal, displayAnswers }) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.questions.viewedQuestions[id]);
  const currentUsername = useSelector((state) => state.user.username);
  const answersSectionRef = useRef();

  //Request Data From API
  useEffect(() => {
    setTimeout(() => {
      dispatch(pushQuestion({ id, data: posts[id] }));
    }, 500);
  }, []);

  return (
    <Card {...(modal && { sx: { display: "flex", flexDirection: "column", height: "100%" } })}>
      <CardHeader
        avatar={<Avatar src={data?.avatar} aria-label="recipe" />}
        title={
          <Link
            to={`/users/${data?.username}`}
            onClick={() => dispatch(closeModal())}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            {data?.displayName}
          </Link>
        }
        titleTypographyProps={{ fontWeight: "500" }}
        subheader={data?.date}
        {...(modal || currentUsername === data?.username
          ? {
              action: (
                <>
                  {currentUsername === data?.username ? (
                    <AuthorOptions questionId={id} isSolved={data?.isSolved} />
                  ) : null}
                  {modal ? (
                    <IconButton aria-label="close question" onClick={() => dispatch(closeModal())}>
                      <Close />
                    </IconButton>
                  ) : null}
                </>
              ),
            }
          : null)}
      />

      <Divider />

      {/* ============================ */}

      <Box flexGrow={1} overflow="auto">
        <CardContent>
          <Typography mb={0.5} variant="h6" component="h2">
            {data?.title}
          </Typography>
          <Chip
            label={data?.isSolved ? "Solved" : "Not Solved"}
            color={data?.isSolved ? "success" : "error"}
            sx={{ paddingInline: 0.75 }}
            size="small"
          />
          <Typography variant="body2" mt={2} color="text.secondary">
            {data?.content?.split("\n").map((line, i) => (
              <Fragment key={i}>
                {i > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </Typography>
        </CardContent>

        {/* ============================ */}

        <CardActions disableSpacing>
          <SaveButton id={id} isSaved={data?.isSaved} />

          <CopyLink id={id} />

          <Tooltip describeChild title="Write An Answer">
            <IconButton
              onClick={() => {
                !displayAnswers && dispatch(openModal(id));
                answersSectionRef.current?.focus();
              }}
            >
              <Chat />
            </IconButton>
          </Tooltip>
        </CardActions>

        {/* ============================ */}

        {modal || displayAnswers ? (
          <>
            <Divider />
            <AnswersSection id={id} />
          </>
        ) : null}
      </Box>

      {modal || displayAnswers ? <InputAnswer ref={answersSectionRef} id={id} /> : null}
    </Card>
  );
};

export default Question;
