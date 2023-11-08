import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
} from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { RoomProvider } from "./context/RoomContext";
import { WaitingRoom } from "./pages/WaitingRoom";
import { ViewingRoom } from "./pages/ViewingRoom";
import { MeetingRoom } from "./pages/MeetingRoom";

export default function App() {
  return (
    <div className="App">
      <Router>
        <UserProvider>
          <Routes>
            <Route path="/viewing-room/:rId" element={<RoomProvider><ViewingRoom /></RoomProvider>} />
            <Route path="/meeting-room/:rId" element={<RoomProvider><MeetingRoom /></RoomProvider>} />
            <Route path="/waiting-room" element={<WaitingRoom />} />
            <Route path="/" element={<Navigate replace to="/waiting-room" />} />
          </Routes>
        </UserProvider>
      </Router>
    </div>
  );
}
