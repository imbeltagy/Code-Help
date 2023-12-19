import styled from "@emotion/styled";
import SearchIcon from "@mui/icons-material/Search";
import { InputBase, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const Container = styled(Stack)(({ theme }) => ({
  gap: ".5rem",
  borderRadius: "10rem",
  border: `2px solid ${theme.palette.text.disabled}`,
  "&:hover": { borderColor: theme.palette.text.secondary },
  "& path": { fill: theme.palette.text.secondary },
  "&:has(*:focus)": { borderColor: theme.palette.primary.main },
}));

const SearchBar = styled("div")(({ theme }) => ({
  width: "100%",
  background: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  display: "flex",
  alignItems: "center",
  gap: ".5rem",
}));

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchVal, setSearchVal] = useState("");

  // Update Search param value
  useEffect(() => {
    const search = setTimeout(() => {
      setSearchParams((params) => {
        if (searchVal == "") {
          params.delete("search");
        } else {
          params.set("search", searchVal);
        }
        return params;
      });
    }, 500);

    return () => clearTimeout(search);
  }, [searchVal]);

  return (
    <Container direction="row" alignItems="center" p=".15rem .8rem">
      <SearchBar>
        <SearchIcon sx={{ color: "#a2a2a2" }} />
        <InputBase
          onChange={(e) => {
            setSearchVal(e.target.value);
          }}
          placeholder="Search..."
          sx={{ flexGrow: 1 }}
        />
      </SearchBar>
    </Container>
  );
};

export default Search;
