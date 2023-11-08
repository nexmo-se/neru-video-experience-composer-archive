
import { useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import { CustomRecorderList } from "./list";

export function CustomRecorderListButton() {

  const [openList, setOpenList] = useState(false);

  const toggleOpenList = () => {
    setOpenList((prev) => !prev);
  };

  return (<>
    <Tooltip title="Custom Recordings" arrow >
      <IconButton
        edge="start"
        color="inherit"
        aria-label="Custom Recordings"
        onClick={() => toggleOpenList(true)}
      > 
        <PlaylistPlayIcon fontSize="inherit" color={openList? "success" : "info"} />
      </IconButton>
    </Tooltip>
    
    {/** --- */}
    <CustomRecorderList
      open={openList} 
      toggleOpen={toggleOpenList}
    />
    {/** --- */}

  </>);
}