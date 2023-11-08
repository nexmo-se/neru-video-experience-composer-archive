import { memo, useContext, useState, useEffect } from "react";
import { IconButton, Tooltip } from "@mui/material";
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { RoomContext } from "../../context/RoomContext";
import { startArchive, stopArchive } from "../../api/room";

export const ArchiveButton = memo(() => {
  const { 
    roomId, 
    isArchiving, 
  } = useContext(RoomContext);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const toggleArchive = async (e) => {
    if (!window.confirm(`Are you sure you want to ${!isArchiving? "start" : "stop"} recording?`)) {
      setIsButtonDisabled(false);
      return;
    }

    setIsButtonDisabled(true);
    try {
      if (!isArchiving) {
        await startArchive(roomId);
      }
      else if (isArchiving) {
        await stopArchive(roomId);
      }

    } catch (error) {
      console.log(error.message);
      setIsButtonDisabled(false);
    }
  };

  useEffect(() => {
    setIsButtonDisabled(false);
  }, [isArchiving]);

  return (
    <Tooltip title={`${isArchiving ? "Stop" : "Start"} Recording(Archive API)`} ><span>
      <IconButton edge="start" color="inherit" aria-label="archive" 
        disabled={isButtonDisabled}
        onClick={toggleArchive}
      >
        <RadioButtonCheckedIcon fontSize="inherit" color={isArchiving? "error" : "inherit"} />
      </IconButton></span>
    </Tooltip>
  );
});
