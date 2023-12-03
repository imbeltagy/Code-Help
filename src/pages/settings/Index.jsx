import { Avatar, Box, Button, Stack, TextField } from "@mui/material";
import React, { useLayoutEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Settings = () => {
  const [info, setInfo] = useState({});
  const [newInfo, setNewInfo] = useState({});
  const isButtonsDisabled =
    Object.keys(info).every((key) => (key == "avatar" ? newInfo.avatar == undefined : info[key] == newInfo[key])) ||
    Object.keys(newInfo).length == 0;
  const avatar = newInfo.avatarFile ? URL.createObjectURL(newInfo.avatarFile) : info.avatar;

  const { register, handleSubmit } = useForm();

  // Get Info From API
  useLayoutEffect(() => {
    setTimeout(() => {
      setInfo({
        username: "beltagy",
        displayName: "Mohammed Beltagy",
        avatar: undefined,
        brief:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta officiis explicabo labore porro ut laborum voluptatibus facilis ex neque eaque officia, ducimus omnis optio corporis quos, itaque ad doloremque voluptatem!",
      });
    }, 500);
  }, []);

  // Updte Data
  const handleChange = (data) => {
    setNewInfo({ ...data, avatar: data.avatar[0] });
  };

  // Send Data To API
  const onSubmit = (data) => {};

  // Loading tell getting info from API
  if (Object.keys(info).length == 0) return "loading...";

  // After Response
  return (
    <form onSubmit={handleSubmit(onSubmit)} onChange={handleSubmit(handleChange)} onReset={() => setNewInfo({})}>
      <Stack gap={3}>
        {/* Avatar Row */}
        <Stack direction="row" alignItems="flex-end" gap={2}>
          <Avatar
            src={avatar}
            alt="Profile Picture"
            variant="rounded"
            sx={{ width: "6rem", height: "6rem", border: "1px solid" }}
          />

          {/* Upload Button */}
          <input {...register("avatar")} accept="image/*" id="raised-button-file" type="file" hidden />
          <label htmlFor="raised-button-file">
            <Button size="small" variant="contained" component="span">
              Upload Picture
            </Button>
          </label>
        </Stack>

        {/* Fields */}
        <TextField {...register("username")} label="Username" defaultValue={info.username} />
        <TextField {...register("displayName")} label="Display Name" defaultValue={info.displayName} />
        <TextField {...register("brief")} label="Brief" defaultValue={info.brief} multiline rows={5} />

        {/* Buttons */}
        <Box display="flex" flexDirection="row" gap="1rem">
          <Box flex="1 1 auto" />
          <Button type="reset" disabled={isButtonsDisabled}>
            Reset
          </Button>
          <Button type="submit" variant="contained" disabled={isButtonsDisabled}>
            Next
          </Button>
        </Box>
      </Stack>
    </form>
  );
};

export default Settings;
