
import { useRef, useContext, useState, useCallback, useEffect } from "react";
import useStyles from "./styles";
import { RoomContext } from "../../context/RoomContext";
import { MicButton } from "../MicButton";
import { VideoButton } from "../VideoButton";
import { ScreenShareButton } from "../ScreenShareButton";
import { RenderButton } from "../RenderButton";
import { RenderListButton } from "../RenderListButton";
import { ArchiveButton } from "../ArchiveButton";
import { ArchiveListButton } from "../ArchiveListButton";
import { CustomRecorderButton } from "../CustomRecorderButton";
import { CustomRecorderListButton } from "../CustomRecorderListButton";

export const ControlToolBar = ({
  className,
  hasAudio,
  hasVideo,
  handleMicButtonClick,
  handleVideoButtonClick,
}) => {
  const { session, connection } = useContext(RoomContext);

  const visibleTimerRef = useRef();

  const [visible, setVisible] = useState(true);

  const classes = useStyles();

  const visibleTimer = 5000;
  const startTimer = useCallback(() => {
    visibleTimerRef.current = setTimeout(() => {
      setVisible(false);
    }, visibleTimer);
  }, []);

  const handleMouseEnter = () => {
    clearTimeout(visibleTimerRef.current);
    setVisible(true);
  };

  const handleMouseLeave = () => {
    startTimer();
  };

  useEffect(() => {
    startTimer();
  }, [startTimer]);

  if (!session || !connection) return "";
  else {
    return (
    <div
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`${classes.controlToolbar} ${!visible? classes.hidden : ""}`}
      >
        <MicButton
          hasAudio={hasAudio}
          onClick={handleMicButtonClick}
        ></MicButton>

        <VideoButton
          hasVideo={hasVideo}
          onClick={handleVideoButtonClick}
        ></VideoButton>

        <ScreenShareButton />

        <RenderButton />
        <RenderListButton />

        <ArchiveButton />
        <ArchiveListButton />
        
        <CustomRecorderButton />
        <CustomRecorderListButton />

      </div>
    </div>
    );
  }
};
