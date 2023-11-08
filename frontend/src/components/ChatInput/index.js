import { useState, useContext, memo } from "react";
import { Box, TextField, Button } from "@mui/material";
import { UserContext } from "../../context/UserContext";
import { RoomContext } from "../../context/RoomContext";

export const ChatInput = memo(() => {
  const { user } = useContext(UserContext);
  const { 
    session,
    sendSignalChat,
  } = useContext(RoomContext);

  const [text, setText] = useState("");

  const handleClickSend = async (e) => {
    e.preventDefault();
    let _text = text.replace(/^\s+|\s+$/g, "");
    if (_text.length) {
      try {
        await sendSignalChat({text: _text, username: user.username});
      } catch (error) {
        console.log(error.message);
      }
    }
    setText("");
  };

  const changeText = (e) => {
    setText(e.target.value);
  };

  if (!session) return "";
  else 
    return (
      <Box 
        sx={{ 
          width: "100%", 
          overflow: "hidden",
        }}
      >
        <TextField size="small" multiline rows={3} fullWidth
          onChange={changeText}
          onKeyDown={(e) => { if (e.key === 13) handleClickSend(e); }}
          id="standard-text"
          value={text}
        />
        <Button size="small" sx={{mt: 0.5, width: "100%"}} 
          variant="contained"
          color="primary"
          aria-label="Send" 
          onClick={handleClickSend}
        >{ "Send" }</Button>
      </Box>);
});


