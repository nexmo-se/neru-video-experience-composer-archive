import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback
} from 'react';
import useStyles from './styles';
import LayoutManager from "../../utils/layout-manager";
import { getCredentials } from '../../api/credentials';
import { UserContext } from '../../context/UserContext';
import { usePublisher } from '../../hooks/usePublisher';
import { useSession } from '../../hooks/useSession';
import { ControlToolBar } from '../ControlToolBar';
import { ChatList } from '../ChatList';
import { ChatInput } from '../ChatInput';

export function VideoRoom() {
  const videoContainerRef = useRef();
  const resizeTimeoutRef = useRef();

  const { user, canUserPublish, room } = useContext(UserContext);

  const [credentials, setCredentials] = useState(null);
  const [hasAudio, setHasAudio] = useState(user.defaultSettings.publishAudio);
  const [hasVideo, setHasVideo] = useState(user.defaultSettings.publishVideo);
  const [showChat, setShowChat] = useState(true);
  const [layoutManager, setLayoutManager] = useState(new LayoutManager("video-container"));
  
  const classes = useStyles();

  const { 
    publisher,
    publish,
    isPublishing,
  } = usePublisher();

  const { 
    session,
    createSession, 
    connected,
    isRecording,
    setIsRecording,
   } = useSession({
    container: "video-container"
  });

  const toggleAudio = useCallback(() => {
    setHasAudio((prevAudio) => !prevAudio);
  }, []);

  const toggleVideo = useCallback(() => {
    setHasVideo((prevVideo) => !prevVideo);
  }, []);

  const toggleShowChat = useCallback(() => {
    setShowChat((prev) => !prev);
    setTimeout(function () {
      layoutManager.layout();
    }, 100);
  }, []);

  useEffect(() => {
    getCredentials(room.id).then((data) => {
      setCredentials(data);
      if (data.isRecording) setIsRecording(true);
    });
  }, []);

  useEffect(() => {
    if (credentials) {
      createSession(credentials);
    }
  }, [createSession, credentials]);

  useEffect(() => {
    if (session && connected && !isPublishing && canUserPublish) {
      let publisherOptions = {
        publishAudio: hasAudio,
        publishVideo: hasVideo,
        name: user.username, 
      };
      publish({
        container: videoContainerRef.current.id,
        session: session,
        publisherOptions
      });
    }
    if (session && connected && canUserPublish) {
      layoutManager.layout();
    }
  }, [publish, session, connected, isPublishing, canUserPublish]);

  useEffect(() => {
    if (publisher && canUserPublish) {
      publisher.publishAudio(hasAudio);
    }
  }, [hasAudio, publisher, canUserPublish]);

  useEffect(() => {
    if (publisher && canUserPublish) {
      publisher.publishVideo(hasVideo);
    }
  }, [hasVideo, publisher, canUserPublish]);

  useEffect(() => {
    window.onresize = function() {
      clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(function () {
        layoutManager.layout();
      }, 100);
    };
    return (() => {
      clearTimeout(resizeTimeoutRef.current);
    })
  }, []);

  return (
  <div className={classes.container}>
    <div id="video-container"
      className={`${classes.videoContainer} ${!showChat? classes.fullWidth : ""}`}
      ref={videoContainerRef}
    ></div>

    <div id="chat-container"
      className={`${classes.chatContainer} ${!showChat? "" : classes.visible}`}
      >
      <ChatList toggleShowChat={toggleShowChat}></ChatList>
      { connected? <ChatInput session={session}></ChatInput> : ''}
    </div>
    
    {publisher && canUserPublish && connected ? 
    <ControlToolBar
      className={`${classes.controlToolbar} ${!showChat? "" : classes.left40}`}
      hasAudio={hasAudio}
      hasVideo={hasVideo}
      handleMicButtonClick={toggleAudio}
      handleVideoButtonClick={toggleVideo}
      roomId={room.id} 
      sessionId={credentials.sessionId}
      recorderSessionId={credentials.recorderSessionId}
      isRecording={isRecording} 
      setIsRecording={setIsRecording}
      showChat={showChat}
      toggleShowChat={toggleShowChat}
    /> : ''}
  </div>);
}
