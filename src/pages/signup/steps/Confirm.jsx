import { Alert, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";

const Confirm = ({ handleBack, userInfo }) => {
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();

  const handleFinish = useCallback(() => {
    setSending(true);
    setTimeout(() => {
      // const data = new FormData();
      // data.append("file", userInfo.avatar);
      // data.append("user", "hubot");
      // fetch('/', {
      //   method: 'POST',
      //   body: data
      // })
      setSending(false);
      navigate("/login");
    }, 500);
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
