import { useContext, useState, useEffect } from "react";
import { Tooltip, IconButton } from '@mui/material';
import { ScreenShare, StopScreenShare } from "@mui/icons-material";
import { RoomContext } from "../../context/RoomContext";
import { usePublisher } from "../../hooks/usePublisher";

export function ScreenShareButton() {
  const {session} = useContext(RoomContext);
  
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const {
    // publisher,
    isPublishing,
    publish, 
    unpublish,
    destroyPublisher,
  } = usePublisher();

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing && !isPublishing) {
          await publish(session, "publisher-container", {
            videoSource: "screen",
          });
          setIsScreenSharing(true);
      }
      else if (isScreenSharing || isPublishing) {
        unpublish(session);
        destroyPublisher();
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    setIsScreenSharing(isPublishing);
  }
  , [isPublishing]);

  return (<>
    <Tooltip title="Click to Share Screen">
    <IconButton 
      edge="start" 
      color="inherit" 
      aria-label="Share Screen" 
      onClick={toggleScreenShare}
    >
      {isScreenSharing
        ? <ScreenShare fontSize="inherit" color="success"/>
        : <StopScreenShare fontSize="inherit" />
      }
    </IconButton>
    </Tooltip>
  </>);
}
