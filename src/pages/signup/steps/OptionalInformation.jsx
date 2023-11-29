import { Avatar, Box, Button, Stack, TextField } from "@mui/material";
import { useRef, useState } from "react";

const OptionalInformation = ({ handleNext, setUserInfo }) => {
  const [file, setFile] = useState();
  const nameInput = useRef();
  const briefInput = useRef();

  const handleUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = () => {
    setUserInfo((prev) => ({
      ...prev,
      avatar: file,
      displayName: nameInput.current.value?.match(/\w/)
        ? nameInput.current.value.replace(/\s+/g, " ").trim() // remove spaces
        : prev.username,
      brief: briefInput.current.value,
    }));
    handleNext();
  };

  return (
    <Stack gap={3}>
      <Stack direction="row" alignItems="flex-end" gap={2}>
        <Avatar
          src={file ? URL.createObjectURL(file) : ""}
          alt="Profile Picture"
          variant="rounded"
          sx={{ width: "6rem", height: "6rem", border: "1px solid" }}
        />
        <input accept="image/*" id="raised-button-file" type="file" hidden onChange={handleUpload} />
        <label htmlFor="raised-button-file">
          <Button size="small" variant="contained" component="span">
            Upload Picture
          </Button>
        </label>
      </Stack>
      <TextField ref={nameInput} label="Display Name" />
      <TextField ref={briefInput} multiline rows={5} label="Brief" />
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Box sx={{ flex: "1 1 auto" }} />

        <Button onClick={handleSubmit}>Next</Button>
      </Box>
    </Stack>
  );
};

export default OptionalInformation;
