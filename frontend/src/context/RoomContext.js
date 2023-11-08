import { createContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useChat } from "../hooks/useChat";
import { getInfo } from "../api/room";

export const RoomContext = createContext();

export function RoomProvider({children}) {
  const { rId } = useParams();

  const [roomId, setRoomId] = useState(rId);
  const [session, setSession] = useState(null);
  const [connection, setConnection] = useState(null); // the local connection

  // just the Archive API
  const [isArchiving, setIsArchiving] = useState(false);
  const [archiveId, setArchiveId] = useState(null);

  // custom recorder with Experience Composer and Archive API
  const [isRecorderRecording, setIsRecorderRecording] = useState(false);
  const [recorderSessionId, setRecorderSessionId] = useState(null);

  // related to custom recording
  const onSignalRecorder = ({type, data, from}) => {
    if (type === "signal:recorder") {
      const { 
        recorderSessionId,
        status, 
      } = JSON.parse(data);

      if (recorderSessionId) setRecorderSessionId(recorderSessionId);
      
      if ("stopped" === status) {
        setIsRecorderRecording(false);
      } else if ("started" === status) {
        setIsRecorderRecording(true);
      }

    }
  };

  // related to just archive api
  const onSignalArchive = ({type, data}) => {
    if (type === "signal:archive") {
      const { status, archiveId } = JSON.parse(data);

      if ("started" === status) {
        setIsArchiving(true);
        if (archiveId) setArchiveId(archiveId);
      }
      else if ("stopped" === status) {
        setIsArchiving(false);
        setArchiveId(null);
      }
    }
  };

  const {
    messages, 
    addMessages,
    onSignalChat,
    sendSignalChat,
  } = useChat({ session });

  useEffect(() => {
    getInfo(roomId).then((data) => {
      
      if (data?.archiveId) {
        setArchiveId(data.archiveId);
        setIsArchiving(true);
      }

      if (data?.recorderSessionId) {
        setRecorderSessionId(data.recorderSessionId);
      }

      if (data?.recorderRenderId || data?.recorderArchiveId ) {
        setIsRecorderRecording(true);
      }

    }).catch(console.log);

  }, [roomId]);


  return (
    <RoomContext.Provider 
      value={{
        roomId, setRoomId,
        session, setSession,
        connection, setConnection,
        
        messages,
        addMessages,
        onSignalChat,
        sendSignalChat,

        archiveId,
        isArchiving,
        onSignalArchive,

        recorderSessionId,
        isRecorderRecording,
        onSignalRecorder,
        
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}

// export default function useRoomContext() {
//   return useContext(RoomContext);
// }
