// import { v4 as uuidv4 } from 'uuid';
import { createContext, useState, useMemo, useEffect } from "react";
import { useQuery } from '../hooks/useQuery';

export const UserContext = createContext();
export function UserProvider({ children }) {

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

  useEffect(() => {
    let userRole = query.get('ec') ? 'viewer' : user.userRole;
    setUser({ ...user, userRole });
    setCanUserPublish(userRole !== 'viewer');
  }, []);

  const value = useMemo(() => (
    {
      user,
      setUser,
      canUserPublish,
    }
  ), [
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
