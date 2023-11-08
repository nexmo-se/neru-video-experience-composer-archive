import { useContext, useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useStyles from "./styles";
import { Button, Stack } from "@mui/material";
import { UserContext } from "../../context/UserContext";
import { usePublisher } from "../../hooks/usePublisher";
import { AudioSettings } from "../../components/AudioSetting";
import { VideoSettings } from "../../components/VideoSetting";
import { RoomSelect } from "../../components/RoomSelect";

export function WaitingRoom() {
  const waitingRoomVideoContainerRef = useRef();

  const { user, setUser } = useContext(UserContext);

  const [localAudio, setLocalAudio] = useState(user.defaultSettings.publishAudio);
  const [localVideo, setLocalVideo] = useState(user.defaultSettings.publishVideo);
  const [localRoomId, setLocalRoomId] = useState("room-0");

  const { 
    publisher, initPublisher, 
  } = usePublisher();

  const classes = useStyles();

  const navigate = useNavigate();

  const handleAudioChange = useCallback((e) => {
    setLocalAudio(e.target.checked);
  }, []);

  const handleVideoChange = useCallback((e) => {
    setLocalVideo(e.target.checked);
  }, []);

  const handleRoomChange = useCallback((e) => {
    setLocalRoomId(e.target.value);
  }, []);

  const handleUsernameChange = useCallback((e) => {
    setUser({ ...user, username: e.target.value });
  }, []);

  const handleJoinClick = () => {
    localStorage.setItem("username", user.username);
    localStorage.setItem("localAudio", localAudio);
    localStorage.setItem("localVideo", localVideo);
    navigate({
      pathname: `/meeting-room/${localRoomId}`
    });
  };

  useEffect(() => {
    setUser({ ...user, defaultSettings: {
      publishAudio: localAudio,
      publishVideo: localVideo
    }});
  }, [localVideo, localAudio]);

  useEffect(() => {
    if (!publisher) {
      initPublisher(waitingRoomVideoContainerRef.current, {
        publishAudio: localAudio,
        publishVideo: localVideo,
      });
    }
  }, [initPublisher, publisher]);

  useEffect(() => {
    if (publisher) {
      publisher.publishAudio(localAudio);
    }
  }, [localAudio, publisher]);

  useEffect(() => {
    if (publisher) {
      publisher.publishVideo(localVideo);
    }
  }, [localVideo, publisher]);

  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <AudioSettings
        hasAudio={localAudio}
        onAudioChange={handleAudioChange}
      />
      <VideoSettings
        hasVideo={localVideo}
        onVideoChange={handleVideoChange}
      />

      <div id="waiting-room-video-container"
        className={classes.waitingRoomVideoPreview}
        ref={waitingRoomVideoContainerRef}
      ></div>

      <RoomSelect 
        localRoomId={localRoomId} 
        handleRoomChange={handleRoomChange}
        handleUsernameChange={handleUsernameChange}
      />
      
      <Button
        variant="contained"
        onClick={handleJoinClick}
      > Join Call </Button>
    </Stack>
  );
}
