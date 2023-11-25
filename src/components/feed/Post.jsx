import { Favorite, Share } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import { useState } from "react";

const Post = ({ data }) => {
  const { fullname, date, media, body, isLiked } = data;

  const [likeState, setLikeState] = useState(isLiked);

  const handleLike = () => {
    setLikeState((prev) => !prev);
  };

  return (
    <Card>
      <CardHeader avatar={<Avatar aria-label="recipe" />} title={fullname} subheader={date} />
      {media ? (
        <CardMedia component="img" sx={{ height: { xs: "15rem", sm: "25rem" } }} image={media.src} alt={media.title} />
      ) : (
        <Divider />
      )}

      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {body}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites" onClick={handleLike} color={likeState ? "error" : ""}>
          <Favorite />
        </IconButton>
        <IconButton aria-label="share">
          <Share />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default Post;
