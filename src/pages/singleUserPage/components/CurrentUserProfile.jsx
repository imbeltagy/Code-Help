import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  InputBase,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import React, { useLayoutEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import AvatarPic from "/src/common/avatarPic/Index";
import { Label } from "@mui/icons-material";

const CurrentUserProfile = () => {
  const userInfo = useSelector((state) => state.user);
  const [newInfo, setNewInfo] = useState({});
  const isButtonsDisabled =
    Object.keys(newInfo).every((key) => userInfo[key] == newInfo[key]) || Object.keys(newInfo).length == 0;

  const { register, handleSubmit } = useForm();

  // Updte Data
  const handleChange = (data) => {
    setNewInfo({ ...data });
  };

  // Send Data To API
  const onSubmit = (data) => {};

  // Loading tell getting info from API
  if (!userInfo.username) return "loading...";

  // After Response
  return (
    <form onSubmit={handleSubmit(onSubmit)} onChange={handleSubmit(handleChange)} onReset={() => setNewInfo({})}>
      <Stack gap={3}>
        {/* Read Only Data */}
        <AvatarPic displayName={userInfo.displayName || userInfo.username} variant="rounded" size="6rem" />
        <TextField
          label="Username"
          defaultValue={userInfo.username}
          InputProps={{
            readOnly: true,
          }}
        />

        {/* Changable Data */}
        <TextField
          {...register("displayName")}
          label="Display Name"
          defaultValue={userInfo.displayName || userInfo.username}
        />
        <FormControl fullWidth>
          <InputLabel id="state-select">State</InputLabel>
          <Select
            {...register("select")}
            label="state"
            defaultValue={"online"}
            onChange={handleSubmit(handleChange)}
            labelId="state-select"
          >
            <MenuItem value={"online"}>Online</MenuItem>
            <MenuItem value={"offline"}>Offline</MenuItem>
            <MenuItem value={"busy"}>Busy</MenuItem>
          </Select>
        </FormControl>
        <TextField {...register("brief")} label="Brief" defaultValue={"brief"} multiline rows={5} />

        {/* Buttons */}
        <Box display="flex" flexDirection="row" gap="1rem">
          <Box flex="1 1 auto" />
          <Button type="reset" disabled={isButtonsDisabled}>
            Reset
          </Button>
          <Button type="submit" variant="contained" disabled={isButtonsDisabled}>
            Save Changes
          </Button>
        </Box>
      </Stack>
    </form>
  );
};

export default CurrentUserProfile;
