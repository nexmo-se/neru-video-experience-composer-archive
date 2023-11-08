import {
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import useStyles from "./styles";
import { Stack } from "@mui/material";
import { getCredentials } from "../../api/credentials";
import { UserContext } from "../../context/UserContext";
import { RoomContext } from "../../context/RoomContext";
import { useSession } from "../../hooks/useSession";
import { ChatMessages } from "../../components/ChatMessages";

const USER_TOKEN_ROLE = "subscriber";

export function ViewingRoom() {
  const { user } = useContext(UserContext);
  const {
    roomId,
    addMessages,
  } = useContext(RoomContext);
  const videoContainerRef = useRef();
  const [credentials, setCredentials] = useState(null);

  const {
    connectSession, 
  } = useSession({
    containerName: "video-container",
  });

  const classes = useStyles();

  useEffect(() => {
    getCredentials(roomId, { ...user, role: USER_TOKEN_ROLE })
      .then((data) => {
        setCredentials(data);
      })
      .catch(console.error);
  }, [user]);

  useEffect(() => {
    if (credentials) connectSession(credentials);
  }, [credentials]);

  useEffect(() => {
    // console.log(user);
    addMessages({from: "SYS", text: "- (Ready to receive chat messages)"});
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

      <Stack 
        direction="column"
        justifyContent="space-between"
        alignItems="stretch"
        spacing={2}
        sx={{ 
          width: "100%", 
          maxWidth: 320, 
          overflow: "auto",
          height: "100vh",
          maxHeight: "100vh",
        }} >
        <ChatMessages/>
      </Stack>
    </Stack>
  );
}
