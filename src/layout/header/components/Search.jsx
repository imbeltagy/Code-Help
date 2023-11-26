import styled from "@emotion/styled";
import SearchIcon from "@mui/icons-material/Search";
import { InputBase } from "@mui/material";
import React from "react";

const SearchBar = styled("div")(({ theme }) => ({
  width: "40%",
  background: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: ".25rem .5rem",
  display: "flex",
  alignItems: "center",
  gap: ".5rem",
}));

const Search = () => {
  return (
    <SearchBar>
      <SearchIcon sx={{ color: "#a2a2a2" }} />
      <InputBase placeholder="Search..." sx={{ flexGrow: 1 }} />
    </SearchBar>
  );
};

export default Search;
