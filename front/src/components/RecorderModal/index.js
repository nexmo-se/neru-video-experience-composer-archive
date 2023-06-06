import { useState, useCallback, useEffect, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableRow, 
  Paper, 
  Tooltip,
  Link
} from "@mui/material";

import StopCircleIcon from '@mui/icons-material/StopCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';

import { stopRecorder } from '../../api/room';
import { listArchive, deleteArchive } from '../../api/archive';
import { RoomContext } from '../../context/RoomContext';

export function RecorderListModal({ open, handleClickClose }) {
  const { room, refresh, setRefresh } = useContext(RoomContext);

  const [rows, setRows] = useState([]);

  const handleStopRow = useCallback(
    (index, row) => {
      if (!window.confirm(`Are you sure you want to stop ${row.id}`)) {
        return;
      }
      stopRecorder(room.id)
        .then(console.log)
        .catch(console.error)
        .finally(setTimeout(() => { setRefresh(Date.now()); }, 500));
      ;
    }
    , [ rows ]);

  const handleDeleteRow = useCallback(
    (index, row) => {
      if (!window.confirm(`Are you sure you want to delete ${row.id}`)) {
        return;
      }
      deleteArchive(row.id)
        .then(console.log)
        .catch(console.error)
        .finally(setTimeout(() => { setRefresh(Date.now()); }, 500));
    }
    , [ rows ]);

  useEffect(
    () => {
      listArchive(room.recorderSessionId).then(( items ) => {
        if (items) {
          setRows(items.filter(i => (i.status !== 'expired')));
        } else {
          setRows([]);
        }
      }).catch(console.error);
    }
    , [ open, refresh ]);

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>Recording List</DialogTitle>
      <DialogContent dividers>
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a dense table">
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={row.id} >
                  <TableCell component="th" scope="row">{(new Date(row.createdAt)).toISOString()} </TableCell>
                  <TableCell align="left">{row.name}</TableCell>
                  <TableCell align="right">
                    {row.status}
                  </TableCell>
                  <TableCell align="right">
                    {
                    row.status === 'started' ? 
                      <IconButton color="warning" onClick={() => handleStopRow(index, row)}>
                        <Tooltip title="Stop Recording" arrow>
                          <StopCircleIcon /></Tooltip></IconButton> 
                    :
                      <IconButton color="error" onClick={() => handleDeleteRow(index, row)}>
                        <Tooltip title="Delete Recording" arrow>
                        <DeleteIcon /></Tooltip></IconButton> 
                    }
                  </TableCell>
                  <TableCell align="right">
                    {row.status === 'available' ? 
                    <Link target="_blank" href={row.url} >
                      <IconButton color="info">
                        <Tooltip title="Download Recording" arrow>
                          <DownloadIcon /></Tooltip></IconButton></Link> : ''}
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