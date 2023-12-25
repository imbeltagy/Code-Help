import { Card, CardContent, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import MiniUserData from "./MiniUserData";
import { useSelector } from "react-redux";

const FriendsPreview = () => {
  const friends = useSelector((state) => state.user.friends);
  console.log(friends);
  if (friends?.length > 0)
    return (
      <>
        <Typography mb="1rem" fontWeight="500" variant="h5" component="h2">
          User Friends
        </Typography>
        <Grid container spacing={2}>
          {friends.map(({ username, display_name, State }, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <Link to={`/question/${username}`} style={{ textDecoration: "none" }}>
                <Card>
                  <CardContent>
                    <MiniUserData displayName={display_name} state={State} />
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </>
    );
};

export default FriendsPreview;
