import React, { useState, useCallback, useEffect, useMemo } from "react";
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

import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { startRender, stopRender, listRender } from '../../api/render';

/** */
const resolutions = ["640x480", "480x640", "1280x720", "720x1280", "1920x1080", "1080x1920"];

export function RenderCreate({ sessionId, open, handleClickClose }) {

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
    startRender(sessionId, formDataObj)
      .then(console.log).catch(console.error).finally(handleClickClose());
  };
  
  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>Starting an Experience Composer</DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom sx={{pb: 2}}>
        {"Use the Experience Composer to capture audio and video of a web application. See the "}
        <Link target="_blank" 
          href="https://tokbox.com/developer/guides/experience-composer/" 
        > {"developer guide"} </Link>
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
          {resolutions && (
            <Select
              label="Resolution"
              labelId="select-label-resolution"
              name="resolution"
              id="select-resolution"
              value={resolution}
              onChange={e => setResolution(e.target.value)}
            >
              {resolutions.map((i, key) => (
                <MenuItem key={`select-resolution-v-${key}`} value={i}>
                  {i}
                </MenuItem>
              ))}
            </Select>
          )}
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >Submit</Button>
        </Box>
        <Typography gutterBottom>
        {"see the "}
        <Link 
          target="_blank"
          href="https://tokbox.com/developer/rest/#starting_experience_composer" 
        > {"REST documentation"} </Link>
        </Typography>

      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleClickClose}>Close</Button>
      </DialogActions>
    </Dialog>
    );
}

/** */
/** */
/** */
export function RenderList({ sessionId, open, handleClickClose }) {
  const [refresh, setRefresh] = useState(Date.now());
  const [rows, setRows] = useState([]);
  
  const handleStopRow = useCallback(
    (index, row) => {
      if (!window.confirm(`Are you sure you want to stop ${row.id}`)) {
        return;
      }
      stopRender(row.id).then(console.log).catch(console.log);
      setTimeout(() => { setRefresh(Date.now()); }, 2000);
    }
    , [rows] );

  useEffect(
    () => {
      listRender().then(({ items }) => {
        if (items) {
          setRows(items.filter(i => (i.sessionId === sessionId && i.status === 'started')));
        } else {
          setRows([]);
        }
      }).catch(console.log);
    }
    , [open, refresh]);

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>Ongoing Experience Composers</DialogTitle>
      <DialogContent dividers>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a dense table">
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={row.id} >
                  <TableCell component="th" scope="row">{(new Date(row.createdAt)).toISOString()} </TableCell>
                  <TableCell align="left">{row.url}</TableCell>
                  <TableCell align="right">
                    {row.status === 'started' ? 
                    <IconButton color="error" onClick={() => handleStopRow(index, row)}>
                      <CancelOutlinedIcon />
                    </IconButton> : row.status}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleClickClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}