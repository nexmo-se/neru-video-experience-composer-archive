import { useState, useContext } from "react";

import { IconButton, Tooltip } from "@mui/material";
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';

import { startRecorder, stopRecorder } from '../../api/room';
import { RoomContext } from '../../context/RoomContext';
import { RecorderListModal } from "../RecorderModal";

export function RecorderButton() {
  const { room, isRecording, setIsRecording } = useContext(RoomContext);

  const [openList, setOpenList] = useState(false);

  function toggleOpenList() {
    setOpenList((prev) => !prev);
  }

  function toggleIsRecording() {
    if (!window.confirm(`Are you sure you want to ${!isRecording? "record": "stop recording"}?`)) {
      return;
    }
    if (!isRecording) {
      startRecorder(room.id).then(console.log).catch(console.error);
    } else {
      stopRecorder(room.id).then(console.log).catch(console.error);
    }
    setIsRecording((prev) => !prev);
  }

  return (
    <>
      <IconButton 
        edge="start" 
        color={isRecording? "error" : "inherit"} 
        aria-label="Record"
        onClick={toggleIsRecording}
      >
        <Tooltip title="Start Recording" arrow>
        <RadioButtonCheckedIcon/></Tooltip>
      </IconButton>

      <IconButton
        edge="start"
        color="inherit"
        aria-label="List all Recording"
        onClick={toggleOpenList}
      >
        <Tooltip title="Recording List" arrow>
        <PlaylistPlayIcon /></Tooltip>
      </IconButton>
      
      <RecorderListModal 
        open={openList}
        handleClickClose={toggleOpenList}
      />
    </>
  );
}
