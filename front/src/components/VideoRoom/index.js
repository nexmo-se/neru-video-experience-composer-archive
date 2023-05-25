import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stack,
} from '@mui/material';
import useStyles from './styles';
import LayoutManager from "../../utils/layout-manager";
import { getCredentials } from '../../api/credentials';
import { UserContext } from '../../context/UserContext';
import { useQuery } from './../../hooks/useQuery';
import { usePublisher } from '../../hooks/usePublisher';
import { useSession } from '../../hooks/useSession';
import { ControlToolBar } from '../ControlToolBar';

export function VideoRoom() {
  const classes = useStyles();

  const { user, setUser } = useContext(UserContext);
  
  const navigate = useNavigate();

  const query = useQuery();

  const [roomId, setRoomId] = useState(null);

  const [credentials, setCredentials] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [hasAudio, setHasAudio] = useState(user.defaultSettings.publishAudio);
  const [hasVideo, setHasVideo] = useState(user.defaultSettings.publishVideo);
  const [layoutManager, setLayoutManager] = useState(new LayoutManager("video-container"));

  const videoContainerRef = useRef();

  const { 
    publisher,
    publish,
    isPublishing,
  } = usePublisher({
    container: "video-container",
    layoutManager
  });

  const { 
    session,
    createSession, 
    connected,
    isRecording,
    setIsRecording,
   } = useSession({
    container: "video-container",
    layoutManager
  });

  const toggleAudio = useCallback(() => {
    setHasAudio((prevAudio) => !prevAudio);
  }, []);

  const toggleVideo = useCallback(() => {
    setHasVideo((prevVideo) => !prevVideo);
  }, []);

  useEffect(() => {
    const _roomId = query.get('room') ?? 'room-0';
    const _userRole = query.get('ec') ? 'subscriber' : 'publisher'; //TODO: host, guest, ec

    let _username = localStorage.getItem('username');
    if (!_username && _userRole === 'publisher') {
      navigate({
        pathname: '/waiting-room',
        search: `?room=${_roomId}`,
      });
    }
    
    getCredentials(_roomId).then((data) => {
      setCredentials(data);
      setUserRole(_userRole);
      setRoomId(_roomId);
      if (data.isRecording) setIsRecording(true);
    });
  }, []);

  useEffect(() => {
    if (credentials) {
      createSession(credentials);
    }
  }, [createSession, credentials]);

  useEffect(() => {
    if ('publisher' === userRole && session && connected && !isPublishing) {
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
  }, [publish, session, connected, isPublishing, userRole]);

  useEffect(() => {
    if ('publisher' === userRole && publisher) {
      publisher.publishAudio(hasAudio);
    }
  }, [hasAudio, publisher, userRole]);

  useEffect(() => {
    if ('publisher' === userRole && publisher) {
      publisher.publishVideo(hasVideo);
    }
  }, [hasVideo, publisher, userRole]);

  useEffect(() => {
    var resizeTimeout;
    window.onresize = function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function () {
        if (layoutManager) layoutManager.layout();
      }, 20);
    };
  }, []);

  return (
  <Stack
    direction="column"
    justifyContent="center"
    alignItems="center"
    spacing={1}
  >
    <div
      id="video-container"
      className={ classes.videoContainer }
      ref={ videoContainerRef }
    >
    </div>
    
    {'publisher' === userRole && connected ? 
    <ControlToolBar
      className={classes.controlToolbar}
      hasAudio={hasAudio}
      hasVideo={hasVideo}
      handleMicButtonClick={toggleAudio}
      handleVideoButtonClick={toggleVideo}
      roomId={roomId} 
      sessionId={credentials.sessionId}
      recorderSessionId={credentials.recorderSessionId}
      isRecording={isRecording} 
      setIsRecording={setIsRecording}
    /> : ''}

  </Stack>);
}
