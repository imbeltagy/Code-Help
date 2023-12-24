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
    const changedData = {
      newDisplayName: displayName && displayName != "" ? displayName : username,
      newBrief: brief ? brief : "",
    };
    // Send Data
    const res = await fetchApi("change_global_info", "PUT", {
      username: userInfo.username,
      ...changedData,
    });

    if (res.success) {
      setSending(false);
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
