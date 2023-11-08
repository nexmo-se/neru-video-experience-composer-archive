import { useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import { RenderList } from "./list";

export const RenderListButton = () => {

  const [openList, setOpenList] = useState(false);

  const toggleOpenList = async () => {
    setOpenList(prev => !prev);
  };

  return (<>
    <Tooltip title="Experience Composer List" >
      <IconButton
        edge="start"
        color="inherit"
        aria-label="Experience Composer List"
        onClick={() => toggleOpenList(true)}
      > 
        <DynamicFeedIcon fontSize="inherit" color={openList? "success" : "info"} />
      </IconButton>
    </Tooltip>

    {/** --- */}
    <RenderList 
      open={openList} 
      toggleOpen={toggleOpenList}
    />
    {/** --- */}
    
  </>);
};