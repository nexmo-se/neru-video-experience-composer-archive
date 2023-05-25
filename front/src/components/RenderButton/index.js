import React, { useState } from "react";

import { IconButton, Tooltip } from "@mui/material";
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import ListIcon from '@mui/icons-material/List';

import { RenderCreate, RenderList } from "../RenderModal";

export function RenderButton({ sessionId }) {
  const [ openCreate, setOpenCreate ] = useState(false);
  const [ openList, setOpenList ] = useState(false);

  function toggleOpenCreate() {
    setOpenCreate((prev) => !prev);
  }

  function toggleOpenList() {
    setOpenList((prev) => !prev);
  }

  return (
    <>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="Start an Experience Composer"
        onClick={toggleOpenCreate}
      >
        <Tooltip title="Start an Experience Composer" arrow>
          <DynamicFeedIcon /></Tooltip>
      </IconButton>
      <RenderCreate 
        sessionId={sessionId}
        handleClickClose={toggleOpenCreate}
        open={openCreate}
      />

      <IconButton
        edge="start"
        color="inherit"
        aria-label="Ongoing Experience Composer List"
        onClick={toggleOpenList}
      >
        <Tooltip title="Ongoing Experience Composer List" arrow>
        <ListIcon /></Tooltip>
      </IconButton>
      <RenderList 
        sessionId={sessionId}
        handleClickClose={toggleOpenList}
        open={openList}
      />
    </>
  );
}
