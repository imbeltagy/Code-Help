import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import AvatarPic from "/src/common/avatarPic/Index";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import fetchApi from "/src/app/fetchApi/Index";

const UpdateInfoForm = ({}) => {
  const userInfo = useSelector((state) => state.user);
  const [newInfo, setNewInfo] = useState({});
  const [stateSelectorVal, setStateSelectorVal] = useState("online");
  const [fetchButtonText, setFetchButtonText] = useState("Save Changes");
  const isButtonsDisabled =
    Object.keys(newInfo).every((key) => newInfo[key] == userInfo[key]) || fetchButtonText == "Loading...";

  const dispatch = useDispatch();

  const { register, handleSubmit, reset } = useForm();

  // Updte Data
  const handleChange = (data) => {
    setNewInfo({ ...data, state: stateSelectorVal });
  };
  const handleChangeState = (e) => {
    setNewInfo((prev) => ({ ...prev, state: e.target.value }));
    setStateSelectorVal(e.target.value);
  };

  // Send Data To API
  const onSubmit = (data) => {
    const sendData = async () => {
      // Change Button Text
      setFetchButtonText("Loading...");

      // Check if the data has been changed before sending
      const data2send = {};

      // Display Name
      userInfo.displayName !== data.displayName ? (data2send.newDisplayName = data.displayName) : null;

      // Brief
      userInfo.brief !== data.brief ? (data2send.newBrief = data.brief) : null;

      // State
      userInfo.state !== data.state ? (data2send.newState = data.state) : null;

      // Send Data
      const res = await fetchApi("change_global_info", "PUT", {
        username: userInfo.username,
        ...data2send,
      });
      if (res.success) {
        location.reload();
      } else {
        // Push Error Notification
        dispatch(
          openNotification({
            type: "error",
            message: "Error on updating info. Please check your connection try again later.",
          })
        );
      }

      // Change Button Text
      setFetchButtonText("save changes");
    };
    !isButtonsDisabled && sendData();
  };

  const resetForm = useCallback(() => {
    reset(); // from useForm()
    setNewInfo({
      displayName: userInfo.displayName,
      brief: userInfo.brief,
      state: userInfo.state,
    });
    setStateSelectorVal(userInfo.state);
  }, [userInfo]);

  useEffect(() => {
    resetForm();
  }, [userInfo]);

  // Loading tell getting info from API
  if (!newInfo.displayName) return "loading...";

  return (
    <form onSubmit={handleSubmit(onSubmit)} onChange={handleSubmit(handleChange)} onReset={() => resetForm()}>
      <Stack gap={3}>
        {/* Read Only Data */}
        <AvatarPic displayName={newInfo.displayName} variant="rounded" size="6rem" />
        <TextField
          label="Username"
          value={userInfo.username}
          InputProps={{
            readOnly: true,
          }}
        />

        {/* Changable Data */}
        <TextField {...register("displayName")} label="Display Name" value={newInfo.displayName} />
        <FormControl fullWidth onChange={() => console.log("ss")}>
          <InputLabel id="state-select">State</InputLabel>
          <Select
            {...register("state")}
            label="state"
            value={stateSelectorVal}
            onChange={handleChangeState}
            labelId="state-select"
          >
            <MenuItem value={"online"}>Online</MenuItem>
            <MenuItem value={"offline"}>Offline</MenuItem>
            <MenuItem value={"busy"}>Busy</MenuItem>
          </Select>
        </FormControl>
        <TextField {...register("brief")} label="Brief" value={newInfo.brief} multiline rows={5} />

        {/* Buttons */}
        <Box display="flex" flexDirection="row" gap="1rem">
          <Box flex="1 1 auto" />
          <Button type="reset" disabled={isButtonsDisabled}>
            Reset
          </Button>
          <Button type="submit" variant="contained" disabled={isButtonsDisabled}>
            {fetchButtonText}
          </Button>
        </Box>
      </Stack>
    </form>
  );
};

export default UpdateInfoForm;
