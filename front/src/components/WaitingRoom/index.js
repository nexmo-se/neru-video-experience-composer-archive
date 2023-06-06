import { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useStyles from './styles';
import { UserContext } from '../../context/UserContext';
import { RoomContext } from '../../context/RoomContext';
import { usePublisher } from '../../hooks/usePublisher';
import { AudioSettings } from '../AudioSetting';
import { VideoSettings } from '../VideoSetting';

import {
  TextField,
  List,
  ListItem,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';

export function WaitingRoom() {
  const waitingRoomVideoContainerRef = useRef();

  const { user, setUser } = useContext(UserContext);
  const { rooms, room, setRoom } = useContext(RoomContext);

  const [localAudio, setLocalAudio] = useState(user.defaultSettings.publishAudio);
  const [localVideo, setLocalVideo] = useState(user.defaultSettings.publishVideo);

  const classes = useStyles();
  const navigate = useNavigate();

  const {
    publisher,
    initPublisher,
    pubInitialised,
  } = usePublisher();

  const handleAudioChange = useCallback((e) => {
    setLocalAudio(e.target.checked);
  }, []);

  const handleVideoChange = useCallback((e) => {
    setLocalVideo(e.target.checked);
  }, []);

  const handleRoomChange = useCallback((e) => {
    setRoom({...room, id: e.target.value});
  }, []);

  const handleUsernameChange = useCallback((e) => {
    let value = e.target.value || `U${ Date.now() }`;
    localStorage.setItem('username', value);
    setUser({ ...user, username: value });
  }, []);

  const handleJoinClick = () => {
    navigate({
      pathname: '/video-room',
      search: `?room=${room.id}`,
    });
  };

  useEffect(() => {
    if (waitingRoomVideoContainerRef.current && !pubInitialised) {
      initPublisher({
        container: waitingRoomVideoContainerRef.current.id,
        publisherOptions: user.defaultSettings
      });
    }
  }, [initPublisher, pubInitialised]);

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

  useEffect(() => {
    setUser({ ...user, defaultSettings: {
      publishAudio: localAudio,
      publishVideo: localVideo
    }});
  }, [localVideo, localAudio]);

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="#fff"
    >
      <AudioSettings
        hasAudio={localAudio}
        onAudioChange={handleAudioChange}
      />
      <VideoSettings
        hasVideo={localVideo}
        onVideoChange={handleVideoChange}
      />

      <div
        id="waiting-room-video-container"
        className={classes.waitingRoomVideoPreview}
        ref={waitingRoomVideoContainerRef}
      ></div>

      <List
        disablePadding
        sx={{ width: '100%', maxWidth: 360}}
      >
      <ListItem disablePadding>

      <FormControl margin="dense" fullWidth>
        <InputLabel id="room-list-select-label">*Select Room</InputLabel>
        {rooms && (
          <Select
            labelId="room-list-select-label"
            id="room-list-select"
            value={room.id}
            onChange={handleRoomChange}
            label="*Select Room"
          >
            {rooms.map((room, index) => (
              <MenuItem key={index} value={`room-${index}`}>
                {room}
              </MenuItem>
            ))}
          </Select>
        )}
      </FormControl>

      </ListItem>
      <ListItem disablePadding>

      <FormControl margin="dense" fullWidth>
        <TextField
          id="username"
          label="*Your Name"
          value={user.username}
          onChange={handleUsernameChange}
        />
        </FormControl>
        </ListItem>
      </List>

      <Button
        variant="contained"
        onClick={handleJoinClick}
      >
      Join Call
      </Button>
    </Grid>
  );
}
