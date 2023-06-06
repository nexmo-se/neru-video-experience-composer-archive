import "./App.css";

import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
} from "react-router-dom";

import { UserProvider } from "./context/UserContext";
import { RoomProvider } from "./context/RoomContext";
import { MessageProvider } from "./context/MessageContext";
import { WaitingRoom } from "./components/WaitingRoom";
import { VideoRoom } from "./components/VideoRoom";

function App() {
  return (
    <div className="App">
    <Router>
     <UserProvider>
     <RoomProvider>
        <Routes>
          <Route path="/video-room" exact 
            element={<MessageProvider><VideoRoom /></MessageProvider>}
          />
          <Route path="/waiting-room" exact element={ <WaitingRoom /> } />
          <Route path="/" element={<Navigate replace to="/waiting-room" />} />
        </Routes>
        </RoomProvider>
      </UserProvider>
    </Router>
    </div>
  );
}

export default App;
