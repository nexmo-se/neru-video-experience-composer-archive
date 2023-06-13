import { useState, useContext } from 'react';

import { TextField, Button } from "@mui/material";

import { UserContext } from '../../context/UserContext';
// import { RoomContext } from '../../context/RoomContext';
import { MessageContext } from '../../context/MessageContext';

import useStyles from "./styles";

export const ChatInput = ({ session }) => {
  const { user } = useContext(UserContext);
  // const { room } = useContext(RoomContext);
  const { sendMsg } = useContext(MessageContext);
  
  const [text, setText] = useState('');
  const classes = useStyles();

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      sendMsg(session, text, user.username);
      setText('');
    }
  };

  const changeText = (e) => {
    setText(e.target.value);
  };

  return (<div className={classes.chatInput} >
    <TextField
      size="small"
      multiline
      rows={3}
      maxRows={3}
      fullWidth
      onChange={changeText}
      onKeyDown={onKeyDown}
      id="standard-text"
      label="Chat"
      value={text}
    />
    <Button
      sx={{mt: 0.5}}
      variant="contained"
      color="primary"
      aria-label="Send" 
      onClick={() => {
        sendMsg(session, text, user.username);
        setText('');
      }}
    >Send</Button>
  </div>);
};
