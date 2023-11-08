import { memo, useContext } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField, 
  Box
} from "@mui/material";

import { UserContext } from "../../context/UserContext";

const rooms = [{
  id: "room-0",
  name: "Room A",
},{
  id: "room-1",
  name: "Room B",
},{
  id: "room-2",
  name: "Room C",
}];

export const RoomSelect = memo(({
  localRoomId, 
  handleRoomChange, 
  handleUsernameChange
}) => {
  const { user } = useContext(UserContext);

  return (
    <Box sx={{ maxWidth: 320, width: "100%", textAlign: "left" }} >

      {/* room select */}
      <FormControl margin="dense" fullWidth >
        <InputLabel id="room-select-label" >* Select Room</InputLabel>
        <Select
          labelId="room-select-label"
          id="room-select"
          value={localRoomId ?? null}
          onChange={handleRoomChange}
          label="* Select Room"
        >
          {rooms.map(({id, name}, key) => (
            <MenuItem key={key} value={id}>{name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* user name input */}
      <FormControl margin="dense" fullWidth>
        <TextField
          id="username"
          label="* Your Name"
          value={user.username || `User-${ Date.now() }`}
          onChange={handleUsernameChange}
        />
      </FormControl>
    </Box>
  );
});
