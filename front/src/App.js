
import { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
} from "react-router-dom";
// import { v4 as uuidv4 } from 'uuid';
import { WaitingRoom } from "./components/WaitingRoom";
import { VideoRoom } from "./components/VideoRoom";
import { UserContext } from "./context/UserContext";

import "./App.css";

function App() {
  const _username = localStorage.getItem('username');
  const _userRole = localStorage.getItem('userRole');
  const [user, setUser] = useState({
    username: _username || `U${ Date.now() }`,
    defaultSettings: {
      publishAudio: true,
      publishVideo: true,
    },
  });
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);
  
  return (
    <div className="App">
    <Router>
      <UserContext.Provider value={value}>
        <Routes>
          <Route path="/video-room" exact element={ <VideoRoom /> } />
          <Route path="/waiting-room" exact element={ <WaitingRoom /> } />
          <Route path="/" element={<Navigate replace to="/waiting-room" />} />
        </Routes>
      </UserContext.Provider>
    </Router>
    </div>
  );
}

export default App;