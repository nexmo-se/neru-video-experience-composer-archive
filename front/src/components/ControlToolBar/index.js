
import { useCallback, useEffect, useRef, useState } from "react";

import { MicButton } from "../MicButton";
import { VideoButton } from "../VideoButton";
import { RenderButton } from "../RenderButton";
import { ArchiveButton } from "../ArchiveButton";

import { IconButton } from "@mui/material";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';

import useStyles from "./styles";

export const ControlToolBar = ({
  className,
  hasAudio,
  hasVideo,
  handleMicButtonClick,
  handleVideoButtonClick,
  roomId,
  sessionId,
  recorderSessionId,
  isRecording,
  setIsRecording,
  showChat,
  toggleShowChat,
  // currentPublisher,
}) => {
  // This bar should include mic, camera, chat, screenshare, settings, endCall
  const [visible, setVisible] = useState(true);
  const classes = useStyles();
  const hiddenTimeoutTimer = 8000;
  let hiddenTimeout = useRef();

  const setHiddenTimeout = useCallback(() => {
    hiddenTimeout.current = setTimeout(() => {
      setVisible(false);
    }, hiddenTimeoutTimer);
  }, []);

  function handleMouseEnter() {
    clearTimeout(hiddenTimeout.current);
    setVisible(true);
  }

  function handleMouseLeave() {
    setHiddenTimeout();
  }

  useEffect(() => {
    setHiddenTimeout();
  }, [setHiddenTimeout]);

  return (
    <div
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`${classes.toolbarBackground} ${!visible ? classes.hidden : ""}`}
      >
        <MicButton
          hasAudio={hasAudio}
          onClick={handleMicButtonClick}
        ></MicButton>
        <VideoButton
          hasVideo={hasVideo}
          onClick={handleVideoButtonClick}
        ></VideoButton>
        <RenderButton sessionId={sessionId}/>
        <ArchiveButton
          roomId={roomId} 
          sessionId={recorderSessionId} 
          isRecording={isRecording} 
          setIsRecording={setIsRecording}
        />
        
        <IconButton edge="start" 
          color={showChat? "success":"inherit"} 
          aria-label="chat" 
          onClick={toggleShowChat}
        >
          <ChatOutlinedIcon />
        </IconButton>
      </div>
    </div>
  );
};
