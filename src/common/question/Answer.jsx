import { useTheme } from "@emotion/react";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { close } from "/src/features/questionModal/questionModalSlice";
import { Fragment } from "react";

const Answer = ({ username, content }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const mode = theme.palette.mode;

  return (
    <Stack direction="row" gap={2}>
      <Avatar alt={username} />
      <Box
        paddingBlock={1}
        paddingInline={2}
        borderRadius={theme.shape.borderRadius}
        bgcolor={mode === "light" ? "grey.100" : "#333"}
      >
        <Link
          to={`/users/${username}`}
          onClick={() => dispatch(close())}
          style={{ color: "inherit", textDecoration: "none" }}
        >
          <Typography pb={1} variant="subtitle2" component="span">
            {username}
          </Typography>
        </Link>

        <Typography variant="body2" color="text.secondary">
          {content.split("\n").map((line, i) => (
            <Fragment key={i}>
              {i > 0 && <br />}
              {line}
            </Fragment>
          ))}
        </Typography>
      </Box>
    </Stack>
  );
};

export default Answer;
