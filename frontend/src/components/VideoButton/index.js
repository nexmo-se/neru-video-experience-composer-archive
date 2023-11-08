import {memo} from "react";

import { IconButton } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";

export const VideoButton = memo(({ hasVideo, onClick }) => {
  return (
    <IconButton
      edge="start"
      color="inherit"
      aria-label="videoCamera"
      onClick={onClick}
    >
      {hasVideo ? (
        <VideocamIcon fontSize="inherit" color="success"  />
      ) : (
        <VideocamOffIcon fontSize="inherit" />
      )}
    </IconButton>
  );
});