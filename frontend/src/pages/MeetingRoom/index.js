import {
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import useStyles from "./styles";
import { Stack, Box } from "@mui/material";
import { getCredentials } from "../../api/credentials";
import { UserContext } from "../../context/UserContext";
import { RoomContext } from "../../context/RoomContext";
import { useSession } from "../../hooks/useSession";
import { ControlToolBar } from "../../components/ControlToolBar";
import { ChatMessages } from "../../components/ChatMessages";
import { ChatInput } from "../../components/ChatInput";
import { usePublisher } from "../../hooks/usePublisher";

const USER_TOKEN_ROLE = "publisher";

export function MeetingRoom() {
  const { user } = useContext(UserContext);
  const {
    roomId,
    addMessages,
  } = useContext(RoomContext);

  const videoContainerRef = useRef();
  const publisherContainerRef = useRef();

  const [credentials, setCredentials] = useState(null);
  const [hasAudio, setHasAudio] = useState(user.defaultSettings.publishAudio);
  const [hasVideo, setHasVideo] = useState(user.defaultSettings.publishVideo);
  
  const { 
    publisher, initPublisher, destroyPublisher,
    isPublishing, publish, unpublish 
  } = usePublisher();

  const { 
    session,
    connected,
    connectSession, 
  } = useSession({
    containerName: "video-container",
  });

  const toggleAudio = useCallback(() => {
    localStorage.setItem("localAudio", !hasAudio);
    setHasAudio((prevAudio) => !prevAudio);
  }, []);

  const toggleVideo = useCallback(() => {
    localStorage.setItem("localVideo", !hasVideo);
    setHasVideo((prevVideo) => !prevVideo);
  }, []);
  
  const classes = useStyles();

  useEffect(() => {
    if (user) {
      initPublisher(publisherContainerRef.current, {
        publishAudio: hasAudio,
        publishVideo: hasVideo,
        name: user.username, 
      });
    }
  }, [user]);

  useEffect(() => {
    if (user && roomId) {
      getCredentials(roomId, { ...user, role: USER_TOKEN_ROLE })
      .then(setCredentials)
      .catch(console.log);
    }
  }, [user, roomId]);
  

  useEffect(() => {
    if (credentials) connectSession(credentials);
  }, [credentials]);

  useEffect(() => {
    if (!isPublishing && publisher && session && connected) {
      publish(session);
    }
  }, [session, connected, publisher, isPublishing]);

  useEffect(() => {
    if (publisher) {
      publisher.publishAudio(hasAudio);
    }
  }, [hasAudio, publisher]);

  useEffect(() => {
    if (publisher) {
      publisher.publishVideo(hasVideo);
    }
  }, [hasVideo, publisher]);

  useEffect(() => {
    addMessages({from: "SYS", text: "- (Ready to receive chat messages)"});

    return (() => {
      if (publisher && isPublishing) unpublish(session);
      if (publisher) destroyPublisher();
    });
  }, []);
  
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems="flex-start"
      spacing={0}
      sx={{
        backgroundColor: "rgba(0, 0, 0, .4)",
        height: "100vh",
      }}
    >
      <div id="video-container"
        className={`${classes.videoContainer}`}
        ref={videoContainerRef}
      ></div>

      <ControlToolBar 
        className={`${classes.controlToolbarContainer}`}
        hasAudio={hasAudio}
        hasVideo={hasVideo}
        handleMicButtonClick={toggleAudio}
        handleVideoButtonClick={toggleVideo}
      /> 

      <Stack 
        direction="column"
        justifyContent="space-between"
        alignItems="stretch"
        spacing={1}
        sx={{ 
          width: "100%", 
          maxWidth: 320, 
          overflow: "auto",
          height: "100vh",
          maxHeight: "100vh",
        }}
      >
        <Box sx={{ height: "calc(100vh - 400px)" }} > <ChatMessages /> </Box>
        <Box sx={{ width: "100%", maxHeight: "130px" }} > <ChatInput /> </Box>

        <div id="publisher-container"
          className={classes.publisherContainer}
          ref={publisherContainerRef} 
        ></div>
      </Stack>
    </Stack>);
}
