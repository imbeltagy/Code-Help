import { Link } from "@mui/icons-material";
import { Alert, IconButton, Snackbar, Tooltip } from "@mui/material";
import { useRef, useState } from "react";

const CopyLink = ({ id }) => {
  const ref = useRef();
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    ref.current.select();
    document.execCommand("copy");
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <Tooltip describeChild title="Copy Link">
        <IconButton variant="contained" onClick={handleClick}>
          <Link sx={{ rotate: "-45deg" }} />
        </IconButton>
      </Tooltip>

      {/* Alert On Copy */}
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Copied link successfuly.
        </Alert>
      </Snackbar>

      {/* Input To Hold The Link */}
      <input
        value={`https://${location.host}/question/${id}`}
        readOnly
        ref={ref}
        tabIndex="-1"
        style={{ position: "absolute", zIndex: -1, pointerEvents: "none" }}
      />
    </>
  );
};

export default CopyLink;
