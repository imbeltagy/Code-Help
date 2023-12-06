import { Alert, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "/src/features/user/userSlice";
import fetchApi from "/src/app/fetchApi/Index";

const Confirm = ({ handleBack, userInfo }) => {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleFinish = useCallback(async () => {
    setSending(true);

    // Get Only Needed Values
    const { username, displayName, brief } = userInfo;

    // Send Data To API
    const changeNameRes = await fetchApi("signup", { username, displayName });
    const changeBirefRes = await fetchApi("signup", { username, brief });
    if (changeNameRes.success && changeBirefRes.success) {
      dispatch(login({ username: data.username, remember: rememberMeState }));
      setSending(false);
      navigate("/login");
    } else {
      setError("Please try after a few minutes. If it continues pleae contact us");
    }
  }, []);

  return (
    <Stack>
      {sending ? (
        error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Typography>We are redirecting you... Please don't reload the page.</Typography>
        )
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
