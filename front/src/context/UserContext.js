// import { v4 as uuidv4 } from 'uuid';
import { createContext, useState, useMemo, useEffect } from "react";
import { useQuery } from '../hooks/useQuery';

/**
 * 
 */
const ROOM_LIST = ['Room A', 'Room B', 'Room C'];
const ROOM_DFT = 'room-0';

/**
 * 
 */
export const UserContext = createContext();
export function UserProvider({ children }) {
  
  const [rooms, setRooms] = useState(ROOM_LIST);
  const [room, setRoom] = useState({ id: ROOM_DFT });

  const [canUserPublish, setCanUserPublish] = useState(true);
  const [user, setUser] = useState({
    username: localStorage.getItem('username') || `U${ Date.now() }`,
    userRole: localStorage.getItem('userRole') || 'guest', // host, guest, viewer|ec
    defaultSettings: {
      publishAudio: true,
      publishVideo: true,
    },
  });

  const query = useQuery();

  // const canUserPublish = () => {
  //   return user.userRole !== 'viewer';
  // };

  useEffect(() => {
    setRoom({
      ...room,
      id: query.get('room') || ROOM_DFT
    });

    let userRole = query.get('ec') ? 'viewer' : user.userRole;
    setUser({ ...user, userRole });
    setCanUserPublish(userRole !== 'viewer');
  }, []);

  const value = useMemo(() => (
    {
      rooms,
      room,
      setRoom,
      user,
      setUser,
      canUserPublish,
    }
  ), [
    rooms,
    room,
    setRoom,
    user,
    setUser,
    canUserPublish,
  ]);

  return (
    <UserContext.Provider value={value}>
      { children }
    </UserContext.Provider>
  );
}
