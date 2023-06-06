import { 
  createContext, 
  // useRef, 
  useState, 
  // useMemo, 
  useCallback, 
  useEffect 
} from "react";
import { useQuery } from '../hooks/useQuery';

////////////////////////////////////////////////////////////////////////////////
const ROOM_LIST = ['Room A', 'Room B', 'Room C'];
const ROOM_DFT = 'room-0';
////////////////////////////////////////////////////////////////////////////////

export const RoomContext = createContext();
export function RoomProvider({ children }) {
  
  const [rooms, setRooms] = useState(ROOM_LIST);
  const [room, setRoom] = useState({ id: ROOM_DFT });
  const [isRecording, setIsRecording] = useState(false);
  const [refresh, setRefresh] = useState(Date.now());

  const query = useQuery();

  const signalListener = useCallback((type, data, from) => {
    switch (type) {
      case 'signal:recorder:started':
        setIsRecording(true);
        setRefresh(Date.now());
        break;
      case 'signal:recorder:stopped':
        setIsRecording(false);
        setRefresh(Date.now());
        break;
    }
    
  }, []);

  useEffect(() => {
    setRoom({
      ...room,
      id: query.get('room') || ROOM_DFT
    });
  }, []);

  return (
    <RoomContext.Provider value={{
      rooms,
      room,
      setRoom,
      signalListener,
      isRecording,
      setIsRecording,
      refresh,
      setRefresh
    }}>
      { children }
    </RoomContext.Provider>
  );
}
