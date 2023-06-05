import { useState, useContext } from 'react';

import { TextField, Button } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';

import { UserContext } from '../../context/UserContext';
import { MessageContext } from '../../context/MessageContext';

import useStyles from "./styles";

export const ChatInput = ({ session }) => {
  const { user } = useContext(UserContext);
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

  return (<div className={classes.chatInput}
    >
    <TextField
      size="small"
      sx={{width: "96%"}}
      multiline
      maxRows={3}
      onChange={changeText}
      onKeyDown={onKeyDown}
      id="standard-text"
      label="Chat"
      value={text}
    />
    <Button
      sx={{width: "96%", mt: 1}}
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