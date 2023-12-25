import { Badge, Stack, Typography, styled } from "@mui/material";
import AvatarPic from "/src/common/avatarPic/Index";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-dot": {
    top: "auto",
    bottom: "-18%",
    outline: `2px solid ${theme.palette.background.default}`,
  },
}));

const MiniUserData = ({ state, displayName }) => {
  return (
    <Stack marginBlock="1rem" spacing={1} direction="row" alignItems="flex-end">
      <StyledBadge
        variant="dot"
        color={state === "online" ? "success" : state === "busy" ? "warning" : state === "offline" ? "error" : "error"}
      >
        <AvatarPic displayName={displayName} variant="rounded" />
      </StyledBadge>
      <Typography variant="h6">{displayName}</Typography>
    </Stack>
  );
};

export default MiniUserData;
