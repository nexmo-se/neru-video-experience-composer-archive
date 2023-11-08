import { useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import { ArchiveList } from "./list";

export const ArchiveListButton = () => {

  const [openList, setOpenList] = useState(false);

  const toggleOpenList = async () => {
    setOpenList(prev => !prev);
  };

  return (<>
    <Tooltip title="Recordings(Archive API) " >
      <IconButton
        edge="start"
        color="inherit"
        aria-label="Recordings(Archive API) "
        onClick={() => toggleOpenList(true)}
      > 
        <SubscriptionsIcon fontSize="inherit" color={openList? "success" : "inherit"} />
      </IconButton>
    </Tooltip>

    {/** --- */}
    <ArchiveList 
      open={openList} 
      toggleOpen={toggleOpenList}
    />
    {/** --- */}
    
  </>);
};