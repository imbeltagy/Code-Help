import { Box, Grid, Stack } from "@mui/material";
import Search from "./components/Search";
import { useEffect, useState } from "react";
import UserCard from "./components/UserCard";
import { useSearchParams } from "react-router-dom";
import fetchApi from "/src/app/fetchApi/Index";
import { useSelector } from "react-redux";

const Users = () => {
  const { isFetching, username: currentUser } = useSelector((state) => state.user);
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [noUsersMsg, setNoUsersMsg] = useState("Start typing to show users..");

  // Search for Users
  useEffect(() => {
    // Reset Loading State
    setNoUsersMsg("Loading..");
    setUsers([]);

    const searchVal = searchParams.get("search");

    if (searchVal) {
      // Fetch from API
      const fetchData = async () => {
        const res = await fetchApi(`search?display_name=${searchVal}&current_user_username=${currentUser}`, "GET");
        if (res.success) {
          // Modify object props
          const result = res.data
            .map(({ display_name: displayName, relation: friendshipState, username }) => ({
              displayName,
              friendshipState,
              username,
            }))
            .filter(({ username }) => currentUser != username);

          // Set Users Info
          setUsers(result);
        } else {
          setNoUsersMsg("No users found.");
        }
      };
      !isFetching && fetchData();
    } else {
      setUsers([]);
      setNoUsersMsg("Start typing to show users..");
    }
  }, [searchParams, isFetching]);

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
