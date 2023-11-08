import {memo} from "react";

import { IconButton } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";

export const MicButton = memo(({ hasAudio, onClick }) => {
  return (
    <IconButton edge="start" color="inherit" aria-label="mic" onClick={onClick}>
      {hasAudio ? (
        <MicIcon fontSize="inherit" color="success" />
      ) : (
        <MicOffIcon fontSize="inherit" />
      )}
    </IconButton>
  );
});
