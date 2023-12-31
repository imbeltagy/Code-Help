import { useTheme } from "@emotion/react";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Fragment } from "react";

const AnswerContent = ({ username, displayName, content, date }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const mode = theme.palette.mode;
  return (
    <Box
      paddingBlock={1}
      paddingInline={2}
      borderRadius={theme.shape.borderRadius}
      bgcolor={mode === "light" ? "grey.100" : "#333"}
      overflow="hidden"
    >
      {/* Name & Date */}
      <Box>
        <Link
          to={`/users/${username}`}
          onClick={() => dispatch(closeModal())}
          style={{ color: "inherit", textDecoration: "none" }}
        >
          <Typography pb={1} variant="subtitle2" component="span">
            {displayName}
          </Typography>
        </Link>
        <Typography fontSize=".8rem" color="text.secondary" ml=".3rem" component="span">
          {date}
        </Typography>
      </Box>

      {/* Content */}
      <Typography variant="body2" color="text.secondary" sx={{ wordWrap: "break-word" }}>
        {content.split("\n").map((line, i) => (
          <Fragment key={i}>
            {i > 0 && <br />}
            {line}
          </Fragment>
        ))}
      </Typography>
    </Box>
  );
};

export default AnswerContent;
