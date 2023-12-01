import { Close } from "@mui/icons-material";
import { Box, Card, CardContent, IconButton, Link, Modal, Stack, Typography } from "@mui/material";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

const Signup2Action = ({ text, open, setOpen }) => {
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Card
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(30rem, 90%)",
          textAlign: "center",
        }}
      >
        <CardContent sx={{ paddingBlock: 3 }}>
          <Stack direction="row" gap="1rem" alignItems="center" justifyContent="space-between">
            <p style={{ margin: 0 }}>
              You need to{" "}
              <Link fontWeight="600" underline="none" component={RouterLink} to="/signup">
                sign up
              </Link>{" "}
              to {text}.
            </p>
            <IconButton onClick={() => setOpen(false)}>
              <Close />
            </IconButton>
          </Stack>
        </CardContent>
      </Card>
    </Modal>
  );
};

export default Signup2Action;
