import { useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import WebAssetIcon from '@mui/icons-material/WebAsset';
// import WebAssetOffIcon from '@mui/icons-material/WebAssetOff';
import { RenderForm } from "./form";

export const RenderButton = () => {
  const [openForm, setOpenForm] = useState(false);

  const toggleOpenForm = async () => {
    setOpenForm(prev => !prev);
  };

  return (<>
    <Tooltip title="Click to Start an Experience Composer" >
      <IconButton
        edge="start"
        color="inherit"
        aria-label="Start an Experience Composer"
        onClick={() => toggleOpenForm(true)}
      > 
        <WebAssetIcon fontSize="inherit" color="info"/>
      </IconButton>
    </Tooltip>

    {/** --- */}
    <RenderForm 
      open={openForm} 
      toggleOpen={toggleOpenForm}
    />
    {/** --- */}

  </>);
};