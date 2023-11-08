import {memo} from "react";

import { IconButton } from "@mui/material";

import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';
import SpeakerNotesOffIcon from '@mui/icons-material/SpeakerNotesOff';

export const ChatButton = memo(({ openChat, handleClick }) => {
  return (
    <IconButton
      edge="start"
      color="inherit"
      aria-label="videoCamera"
      onClick={handleClick}
    >
      {openChat ? (
        <SpeakerNotesIcon fontSize="inherit" color="success"  />
      ) : (
        <SpeakerNotesOffIcon fontSize="inherit" />
      )}
    </IconButton>
  );
});

