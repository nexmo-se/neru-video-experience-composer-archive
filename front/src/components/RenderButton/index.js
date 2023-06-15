import React, { useState } from "react";

import { IconButton, Tooltip } from "@mui/material";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import ListIcon from "@mui/icons-material/List";

import { RenderCreate, RenderList } from "../RenderModal";

export function RenderButton({ openTooltip, toggleTooltip }) {

  const [openCreate, setOpenCreate] = useState(false);
  const [openList, setOpenList] = useState(false);

  const toggleOpenCreate = () => {
    setOpenCreate((prev) => !prev);
  }

  const toggleOpenList = () => {
    setOpenList((prev) => !prev);
  }
  
  return (
    <>
      <Tooltip title="1. Click to Start an Experience Composer" arrow 
        placement="top-end" 
        open={openTooltip["RenderButton"]}
        disableFocusListener
        disableHoverListener
        disableTouchListener
      >
      <IconButton
        edge="start"
        color="inherit"
        aria-label="Start an Experience Composer"
        onClick={toggleOpenCreate}
      > <DynamicFeedIcon /> </IconButton>
      </Tooltip>

      <RenderCreate 
        open={openCreate}
        handleClickClose={toggleOpenCreate}
      />

      <Tooltip title="Experience Composer List" arrow 
        placement="top-start" 
        onClose={toggleTooltip("RenderList", false)}
        onOpen={toggleTooltip("RenderList", true)} 
        >
      <IconButton
        edge="start"
        color="inherit"
        aria-label="Ongoing Experience Composer List"
        onClick={toggleOpenList}
      > <ListIcon /> </IconButton>
      </Tooltip>
      
      <RenderList 
        open={openList}
        handleClickClose={toggleOpenList}
      />
    </>
  );
}
