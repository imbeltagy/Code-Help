import { Box, Grid, Stack } from "@mui/material";
import Search from "./components/Search";
import { useEffect, useState } from "react";
import UserCard from "./components/UserCard";
import { useSearchParams } from "react-router-dom";

const fakeUsers = [
  {
    username: "user1",
    displayName: "John Doe",
    friendshipState: "pending",
  },
  {
    username: "user2",
    displayName: "Alice Smith",
    friendshipState: "friends",
  },
  {
    username: "user3",
    displayName: "Bob Johnson",
    friendshipState: "noRelation",
  },
  {
    username: "user4",
    displayName: "Emily Brown",
    friendshipState: "friends",
  },
  {
    username: "user5",
    displayName: "David Wilson",
    friendshipState: "requestedYou",
  },
  {
    username: "user6",
    displayName: "Sophia Garcia",
    friendshipState: "friends",
  },
  {
    username: "user7",
    displayName: "James Martinez",
    friendshipState: "noRelation",
  },
  {
    username: "user8",
    displayName: "Olivia Lopez",
    friendshipState: "requestedYou",
  },
  {
    username: "user9",
    displayName: "William Lee",
    friendshipState: "friends",
  },
  {
    username: "user10",
    displayName: "Ava Gonzalez",
    friendshipState: "noRelation",
  },
];

const Users = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [noUsersMsg, setNoUsersMsg] = useState("Start typing to show users..");

  // Search for Users
  useEffect(() => {
    const searchVal = searchParams.get("search");

    if (searchVal) {
      // Fetch from API
      //
      setUsers(fakeUsers);
      setNoUsersMsg("No users found.");
    } else {
      setUsers([]);
      setNoUsersMsg("Start typing to show users..");
    }
  }, [searchParams]);

  return (
    <Stack pb={4} spacing={4} alignItems="center">
      <Box width="100%" maxWidth="20rem">
        <Search />
      </Box>

      {users.length == 0 ? <Box>{noUsersMsg}</Box> : null}

      <Grid container sx={{ alignItems: "stretch" }}>
        {users.map((user, i) => (
          <Grid item xs={12} sm={6} md={4} lg={4} key={i}>
            <Box p={1} height="100%">
              <UserCard {...user} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

export default Users;
