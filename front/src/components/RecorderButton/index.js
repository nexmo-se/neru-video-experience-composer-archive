import { useState, useContext } from "react";

import { IconButton, Tooltip } from "@mui/material";
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';

import { startRecorder, stopRecorder } from '../../api/room';
import { RoomContext } from '../../context/RoomContext';
import { RecorderListModal } from "../RecorderModal";

export function RecorderButton({ openTooltip, toggleTooltip }) {
  const { room, isRecording, setIsRecording } = useContext(RoomContext);

  const [openList, setOpenList] = useState(false);

  const toggleOpenList = () => {
    setOpenList((prev) => !prev);
  }

  const toggleIsRecording = () => {
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
      <Tooltip title={`2. Click to ${isRecording?"Stop":"Start"} Recording`} arrow 
        placement="top-start"
        open={openTooltip["RecorderButton"]}
        disableFocusListener
        disableHoverListener
        disableTouchListener
      >
      <IconButton 
        edge="start" 
        color={isRecording? "error" : "inherit"} 
        aria-label="Record"
        onClick={toggleIsRecording}
      > <RadioButtonCheckedIcon/> </IconButton>
      </Tooltip>

      <Tooltip title="Recording List" arrow 
        placement="top-start" 
        onClose={toggleTooltip("RecorderList", false)}
        onOpen={toggleTooltip("RecorderList", true)} 
        >
      <IconButton
        edge="start"
        color="inherit"
        aria-label="List all Recording"
        onClick={toggleOpenList}
      > <PlaylistPlayIcon /></IconButton>
      </Tooltip>
      
      <RecorderListModal 
        open={openList}
        handleClickClose={toggleOpenList}
      />
    </>
  );
}
