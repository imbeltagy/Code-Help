import { Link } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { useRef } from "react";
import { open as openNotification } from "/src/features/notification/notificationSlice";
import { useDispatch, useSelector } from "react-redux";

const CopyLink = ({ id }) => {
  const dispatch = useDispatch();
  const ref = useRef();
  const questionApiId = useSelector((state) => state.questions.savedQuestions[id].id);

  const handleCopy = () => {
    ref.current.select();
    document.execCommand("copy");
    dispatch(openNotification({ message: "Link has been copied successfuly.", type: "success" }));
  };

  return (
    <>
      <Tooltip describeChild title="Copy Link">
        <IconButton variant="contained" onClick={handleCopy}>
          <Link sx={{ rotate: "-45deg" }} />
        </IconButton>
      </Tooltip>

      {/* Input To Hold The Link */}
      <input
        value={`${location.host}/question/${questionApiId}`}
        readOnly
        ref={ref}
        tabIndex="-1"
        style={{ position: "absolute", zIndex: -1, pointerEvents: "none" }}
      />
    </>
  );
};

export default CopyLink;
