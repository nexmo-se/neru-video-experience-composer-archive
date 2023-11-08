import { useState, useContext, useEffect } from "react";
import { IconButton, Tooltip } from "@mui/material";
import FiberSmartRecordIcon from '@mui/icons-material/FiberSmartRecord';
import { startRecorder, stopRecorder } from "../../api/recorder";
import { RoomContext } from "../../context/RoomContext";

export function CustomRecorderButton() {
  const {
    roomId,
    isRecorderRecording, 
  } = useContext(RoomContext);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const toggleRecorder = async () => {
    setIsButtonDisabled(true);
    try {
      if (!window.confirm(`Are you sure you want to ${!isRecorderRecording? "start": "stop"} recording with Experience Composer and Archive API`)) {
        setIsButtonDisabled(false);
        return;
      }

      if (!isRecorderRecording) {
        await startRecorder(roomId);
      } 
      else if (isRecorderRecording) {
        await stopRecorder(roomId);
      }

    } catch (error) {
      console.log(error.message);
      setIsButtonDisabled(false);
    }
  };

  useEffect(() => {
    setIsButtonDisabled(false);
  }, [isRecorderRecording]);

  return (
    <Tooltip 
      title={`${isRecorderRecording ? "Stop" : "Start"} Recording with Experience Composer and Archive API`}
      arrow
    ><span>
      <IconButton 
        edge="start" 
        aria-label="Record with Experience Composer and Archive API"
        disabled={isButtonDisabled}
        onClick={() => toggleRecorder()}
      > 
        <FiberSmartRecordIcon fontSize="inherit" color={isRecorderRecording? "error" : "info"} />
      </IconButton></span>
    </Tooltip>
  );
}
