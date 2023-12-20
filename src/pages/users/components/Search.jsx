import styled from "@emotion/styled";
import SearchIcon from "@mui/icons-material/Search";
import { Box, InputBase, Stack } from "@mui/material";
import { useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";

const Container = styled(Stack)(({ theme }) => ({
  borderRadius: "10rem",
  overflow: "hidden",
  "&:hover": { borderColor: theme.palette.text.secondary },
  "&:has(*:focus)": { borderColor: theme.palette.primary.main },
}));

const SearchBar = styled("div")(({ theme }) => ({
  width: "100%",
  background: theme.palette.background.paper,
  borderTopLeftRadius: "10rem",
  borderBottomLeftRadius: "10rem",
  border: `2px solid ${theme.palette.text.disabled}`,
  borderRight: "unset",
  display: "flex",
  alignItems: "center",
}));

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const inputRef = useRef();

  const handleSearch = useCallback(() => {
    setSearchParams((params) => {
      if (inputRef.current.value == "") {
        params.delete("search");
      } else {
        params.set("search", inputRef.current.value);
      }
      return params;
    });
  }, [inputRef]);

  return (
    <Container direction="row" alignItems="stretch" onKeyDown={(e) => e.key == "Enter" && handleSearch()}>
      <SearchBar>
        <InputBase type="search" inputRef={inputRef} placeholder="Search..." sx={{ flexGrow: 1, p: ".15rem .8rem" }} />
      </SearchBar>
      <Box
        component="button"
        sx={{
          border: "none",
          outline: "none",
          cursor: "pointer",
          bgcolor: "primary.dark",
          paddingInline: ".7rem",
          "&:hover, &:focus": { bgcolor: "primary.main" },
          "&:active": { bgcolor: "primary.dark" },
        }}
        onClick={() => handleSearch()}
      >
        <SearchIcon sx={{ color: "#fff" }} />
      </Box>
    </Container>
  );
};

export default Search;
