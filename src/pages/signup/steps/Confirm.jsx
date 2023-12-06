import { Alert, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "/src/features/user/userSlice";
import axios from "axios";

const Confirm = ({ handleBack, userInfo }) => {
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleFinish = useCallback(async () => {
    setSending(true);

    const { username, displayName, brief } = userInfo;
    try {
      await axios.post(
        "http://127.0.0.1:5000/change_display_name",
        { username, newDisplayName: displayName },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      await axios.post(
        "http://127.0.0.1:5000/change_brief",
        { username, newBrief: brief },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      dispatch(login({ username: data.username, remember: rememberMeState }));
      setSending(false);
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <Stack>
      {sending ? (
        <Typography>We are redirecting you... Please don't reload the page.</Typography>
      ) : (
        <>
          <Alert severity="success">Successfuly created your account</Alert>
          <Typography severity="success" p={2} bgcolor="grey.100">
            You can edit your information any time from "Acount Settings" page
          </Typography>
          <Stack mt={3} direction="row" justifyContent="space-between">
            <Button onClick={handleBack}>Back</Button>
            <Button variant="contained" onClick={handleFinish}>
              Finish
            </Button>
          </Stack>
        </>
      )}
    </Stack>
  );
};

export default Confirm;
