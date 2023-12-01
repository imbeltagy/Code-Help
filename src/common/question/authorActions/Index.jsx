import { CheckCircle, Delete, Edit, MoreVert } from "@mui/icons-material";
import { Box, Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { Fragment, useCallback, useState } from "react";
import QuestionEditor from "./Editor";
import { useSelector } from "react-redux";

const AuthorActions = ({ id }) => {
  const [openEditor, setOpenEditor] = useState(false);
  const isSolved = useSelector((state) => state.questions.savedQuestions[id].isSolved);

  // Menu Items
  const handleEdit = () => {
    setOpenEditor(true);
  };
  const handleDelete = () => {};
  const handleSolve = () => {};

  const menuLinks = [
    { icon: <Edit color="primary" />, text: "Edit Question", action: handleEdit },
    {
      icon: <CheckCircle color={isSolved ? "error" : "success"} />,
      text: isSolved ? "Mark As Unsolved" : "Mark As Solved",
      action: handleSolve,
    },
    { icon: <Delete color="error" />, text: "Delete Question", action: handleDelete },
  ];

  // Menu Functions
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const open = Boolean(anchorEl);
  const MenuID = open ? "question-setting-menu" : undefined;

  return (
    <>
      <IconButton
        id="question-settings-button"
        aria-label="open question settings"
        aria-controls={MenuID}
        aria-haspopup="true"
        aria-expanded={open ? "true" : "undefined"}
        onClick={handleClick}
      >
        <MoreVert />
      </IconButton>

      {/* Menu */}
      <Menu
        id={MenuID}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "question-settings-button",
        }}
        // Position
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        // Style
        sx={{
          marginTop: ".5rem",
          "& .MuiList-root": { minWidth: "14rem" },
        }}
      >
        <Box>
          {/* Items */}
          {menuLinks.map(({ text, icon, action }, i) => (
            <Fragment key={i}>
              {i > 0 ? <Divider sx={{ mt: "0 !important", mb: "0 !important" }} /> : null}
              <MenuItem onClick={() => action()} sx={{ padding: "1rem" }}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText>{text}</ListItemText>
              </MenuItem>
            </Fragment>
          ))}
        </Box>
      </Menu>

      {/* Editor */}
      <QuestionEditor id={id} open={openEditor} setOpen={setOpenEditor} />
    </>
  );
};

export default AuthorActions;
