
import { useCallback, useEffect, useRef, useState } from "react";

import { MicButton } from "../MicButton";
import { VideoButton } from "../VideoButton";
import { RenderButton } from "../RenderButton";
import { RecorderButton } from "../RecorderButton";

import { IconButton, Tooltip } from "@mui/material";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";

import useStyles from "./styles";

export const ControlToolBar = ({
  className,
  hasAudio,
  hasVideo,
  handleMicButtonClick,
  handleVideoButtonClick,
  showChat,
  toggleShowChat,
}) => {
  const visibleTimerRef = useRef();

  const visibleTimer = 60000;
  const [visible, setVisible] = useState(true);

  const openTooltipDft = {
    RenderButton: true, 
    RenderList: false, 
    RecorderButton: true, 
    RecorderList: false, 
    ChatBox: true,
  };
  const [openTooltip, setOpenTooltip] = useState(openTooltipDft);

  const classes = useStyles();

  const startTimer = useCallback(() => {
    visibleTimerRef.current = setTimeout(() => {
      setVisible(false);
      let val = {};
      Object.keys(openTooltip).forEach(key => val[key] = false);
      setOpenTooltip({...val})
    }, visibleTimer);
  }, []);

  const handleMouseEnter = () => {
    clearTimeout(visibleTimerRef.current);
    setVisible(true);
    setOpenTooltip(openTooltipDft);
  }

  const handleMouseLeave = () => {
    startTimer();
  }
  
  const toggleTooltip = (el, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    if (!open) return setOpenTooltip(openTooltipDft);
    let val = {};
    Object.keys(openTooltip).forEach(key => val[key] = false);
    setOpenTooltip({...val, [el]: true})
  }

  useEffect(() => {
    startTimer();
  }, [startTimer]);

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

        <RenderButton 
          openTooltip={openTooltip} 
          toggleTooltip={toggleTooltip} 
        />

        <RecorderButton 
          openTooltip={openTooltip} 
          toggleTooltip={toggleTooltip} 
        />
        
        <Tooltip title="Chat messages sent will be recorded too" arrow 
          placement="right"
          open={openTooltip["ChatBox"]}
          disableFocusListener
          disableHoverListener
          disableTouchListener
        >
        <IconButton edge="start" 
          color={showChat? "success":"inherit"} 
          aria-label="chat" 
          onClick={toggleShowChat}
        >
          <ChatOutlinedIcon />
        </IconButton>
        </Tooltip>

      </div>
    </div>
  );
};
