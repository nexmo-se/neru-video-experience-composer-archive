import { memo, useContext, useState } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Button,
  InputLabel,
  Link,
  IconButton
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import { RoomContext } from "../../context/RoomContext";
import { startRender } from "../../api/render";

const resolutions = ["640x480", "480x640", "1280x720", "720x1280", "1920x1080", "1080x1920"];

export const RenderForm = memo(({ open, toggleOpen }) => {
  const { session } = useContext(RoomContext);

  const [url, setUrl] = useState("https://www.google.com.hk/");
  const [urlErrorText, setUrlErrorText] = useState("");
  const [maxDuration, setMaxDuration] = useState("1800");
  const [resolution, setResolution] = useState("1280x720");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url) {
      setUrlErrorText("The minimum length of the URL is 15 characters and the maximum length is 2048 characters");
      return;
    } else {
      setUrlErrorText("");
    }
    const formData = new FormData(e.currentTarget);
    const formDataObj = Object.fromEntries(formData.entries());
    // console.log(formDataObj);
    startRender(session.id, formDataObj)
      .then(console.log)
      .catch(console.log)
      .finally(() => toggleOpen(false));
  };
  
  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>{"Starting an Experience Composer"}</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => toggleOpen(false)}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Typography gutterBottom sx={{pb: 2}}>
          {"Use the Experience Composer to capture audio and video of a web application."}
        </Typography>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{mb: 2}}
          onSubmit={handleSubmit}
        >
          <FormControl fullWidth sx={{mb: 2}}>
            <TextField
              required
              autoFocus
              label="* URL"
              name="url"
              id="input-url"
              placeholder="https://webapp.customer.com"
              value={url}
              onChange={e => setUrl(e.target.value)}
              error={!!urlErrorText}
              helperText={urlErrorText}
            />
          </FormControl>

          <FormControl fullWidth sx={{mb: 2}}>
            <TextField
              label="Max Duration"
              name="maxDuration"
              id="input-max-duration"
              placeholder="1800"
              value={maxDuration}
              onChange={e => setMaxDuration(e.target.value)}
            />
          </FormControl>

          <FormControl fullWidth sx={{mb: 2}}>
            <InputLabel id="select-label-resolution">Resolution</InputLabel>
            <Select
              label="Resolution"
              labelId="select-label-resolution"
              name="resolution"
              id="select-resolution"
              value={resolution}
              onChange={e => setResolution(e.target.value)}
            >
              {resolutions.map((i, key) => (
                <MenuItem key={`select-resolution-${key}`} value={i}>
                  {i}
                </MenuItem>
              ))}
              </Select>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            color="primary"
          >{"Submit"}</Button>
        </Box>

        <Typography gutterBottom sx={{m: 2, fontSize: "small"}}>
          {"Read more: "}
          <Link target="_blank" 
            href="https://tokbox.com/developer/guides/experience-composer/" 
          > {"Developer Guide"} </Link>
          { " and " }
          <Link 
            target="_blank"
            href="https://tokbox.com/developer/rest/#starting_experience_composer" 
          > {"API Documentation"} </Link>
        </Typography>
      </DialogContent>
      
      <DialogActions>
        <Button color="primary" onClick={() => toggleOpen(false)} >{"Close"}</Button>
      </DialogActions>
    </Dialog>
  );
});

