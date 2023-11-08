import { useContext, memo } from "react";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";

import { RoomContext } from "../../context/RoomContext";

export const ChatMessages = memo(() => {

  const {
    messages,
    session,
  } = useContext(RoomContext);
  
  if (!session) return "";
  else 
    return (
      <List 
        sx={{ 
          width: "100%", 
          height: "100%", 
          overflow: "auto",
          "& ul": { padding: 0 } ,
        }}
      >
        {messages.slice(-10).reverse().map((msg, key) => {
          return (<ListItem alignItems="flex-start" key={`chat-messages-${key}`}>
            <ListItemAvatar>
              <Avatar alt={msg.from} src={`/static/images/avatar/${msg.from}.jpg`} />
            </ListItemAvatar>
            <ListItemText
              primary={msg.from || ""}
              secondary={msg.text || "..."}
            />
          </ListItem>);
        })}
      </List>);
});
