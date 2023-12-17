import { Alert, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import fetchApi from "/src/app/fetchApi/Index";

const Confirm = ({ handleBack, userInfo, handleFinish }) => {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState();
  const navigate = useNavigate();

  const handleConfirm = useCallback(async () => {
    setSending(true);

    // Get Only Needed Values
    const { username, displayName, brief } = userInfo;

    // Send Data To API
    const changeNameRes = await fetchApi("change_display_name", "PUT", { username, newDisplayName: displayName });
    const changeBirefRes = await fetchApi("change_brief", "PUT", { username, newBrief: brief });
    if (changeNameRes.success && changeBirefRes.success) {
      console.log(changeNameRes, changeBirefRes);
      setSending(false);
      navigate("/");
      handleFinish();
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
            <Button variant="contained" onClick={handleConfirm}>
              Confirm
            </Button>
          </Stack>
        </>
      )}
    </Stack>
  );
};

export default Confirm;
