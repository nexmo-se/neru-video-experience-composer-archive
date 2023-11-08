import { createContext, useState, useMemo } from "react";
import { useQuery } from "../hooks/useQuery";

export const UserContext = createContext();

export function UserProvider({children}) {
  const query = useQuery();

  var username = localStorage.getItem("username") || `User-${Date.now()}`;
  // For EC-Render clients
  username = !query.get("ec")? username : `EC-Render-${Date.now()}`;

  const [user, setUser] = useState({
    username,
    defaultSettings: {
      publishAudio: localStorage.getItem("localAudio") === 'true',
      publishVideo: localStorage.getItem("localVideo") === 'true',
    },
  });

  const value = useMemo(() => ({
    user,
    setUser,
  }),
  [ user ]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}
