import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import AvatarPic from "/src/common/avatarPic/Index";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ViewProfileBtn = ({ username }) => (
  <Button component={Link} to={`./${username}`} variant="outlined" fullWidth>
    view profile
  </Button>
);

const PendingActions = () => (
  <Stack spacing={1} width="100%">
    <Button variant="outlined" fullWidth>
      remove request
    </Button>
    <ViewProfileBtn />
  </Stack>
);

const RequestedYouActions = () => (
  <>
    <Stack spacing={1} width="100%">
      <Button variant="contained" fullWidth>
        accept
      </Button>
      <Button variant="outlined" fullWidth>
        decline
      </Button>
    </Stack>
    <ViewProfileBtn />
  </>
);

const NoRelationActions = () => (
  <Stack spacing={1} width="100%">
    <Button variant="contained" fullWidth>
      add friend
    </Button>
    <ViewProfileBtn />
  </Stack>
);

// Main Component
const UserCard = ({ username, displayName, friendshipState }) => {
  const { isLogged, username: currentUser } = useSelector((state) => state.user);

  return (
    <Card sx={{ height: "100%", display: "grid", alignItems: "center", paddingBlock: "1rem" }}>
      <CardContent>
        <Stack spacing={1} alignItems="center">
          {/* Avatar */}
          <AvatarPic displayName={displayName} />

          {/* Display Name */}
          <Typography pb={1} variant="body1" fontWeight="900" component="span">
            {displayName}
          </Typography>

          {/* Actions Buttons */}
          {!isLogged || friendshipState == "friends" ? <ViewProfileBtn {...{ username }} /> : null}
          {isLogged && friendshipState == "pending" ? <PendingActions /> : null}
          {isLogged && friendshipState == "requestedYou" ? <RequestedYouActions /> : null}
          {isLogged && friendshipState == "noRelation" ? <NoRelationActions /> : null}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default UserCard;
