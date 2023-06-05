import { useContext } from 'react';
import { Typography, IconButton, Divider } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { MessageContext } from '../../context/MessageContext';

export const ChatList = ({ toggleShowChat }) => {
  const { messages } = useContext(MessageContext);

  return (<>
    <Typography variant="h6" sx={{float: "left"}} color="primary" display="block" gutterBottom>
      Messages
    </Typography>
    <IconButton 
      sx={{float: "right"}}
      edge="start"
      aria-label="Close" 
      onClick={toggleShowChat}
      >
      <CloseIcon></CloseIcon>
      </IconButton>
      <Divider sx={{clear: "both"}}/>
    
      {messages.map((msg, key) => (
        <Typography variant="body1" gutterBottom key={`msg-${key}`}>
        {msg.from || ''}: {msg.text || ''}
        </Typography>
      ))}
  </>);
};