import { useContext, useRef, useEffect } from "react";
import { Typography, IconButton, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { MessageContext } from "../../context/MessageContext";

import useStyles from "./styles";

export const ChatList = ({ toggleShowChat }) => {
  const ref = useRef(null);

  const { messages } = useContext(MessageContext);
  const classes = useStyles();

  useEffect(() => {
    scrollToLastMessage();
  }, [messages]);

  const scrollToLastMessage = () => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  return (<>
    <Typography variant="div" sx={{height: "10%"}} >
      <Typography variant="h6" sx={{float: "left", p: 0.5}} color="primary" display="block" gutterBottom>
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
    </Typography>
    <Divider sx={{clear: "both"}}/>

    <div className={classes.chatList} ref={ref}>
      {messages.map((msg, key) => (
        <Typography 
          sx={{float: "left", p: 0.5, width: "96%", mb: 1}} 
          variant="body1" 
          gutterBottom 
          key={`msg-${key}`} 
        >
        {msg.from || ""}: {msg.text || ""}
        </Typography>
      ))}
    </div>
    
    <Divider sx={{clear: "both"}}/>
  </>);
};
