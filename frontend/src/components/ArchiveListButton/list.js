import { useRef, useState, useCallback, useEffect, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableRow, 
  Paper, 
  Tooltip,
  Button,
  IconButton,
  Typography
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";

import { listArchive, stopArchive, deleteArchive } from "../../api/archive";
import { RoomContext } from "../../context/RoomContext";

const refreshTimerInterval = 2000;

export const ArchiveList = ({ open, toggleOpen }) => {
  const {
    session,
    isArchiving
  } = useContext(RoomContext);

  const refreshTimerRef = useRef();

  const [rows, setRows] = useState([]);

  const startTimer = useCallback(() => {
    if (!refreshTimerRef.current) refreshTimerRef.current = setInterval(() => {
      refreshList();
    }, refreshTimerInterval);
  }, []);

  const stopTimer = useCallback(() => {
    clearInterval(refreshTimerRef.current);
    refreshTimerRef.current = null;
  }, []);

  const handleStopRow = useCallback((index, row) => {
    if (!window.confirm(`Are you sure you want to stop ${row.id}`)) {
      return;
    }
    stopArchive(row.id, session.id)
      .then(console.log)
      .catch(console.log)
      .finally(() => refreshList());
  }, [ rows ]);

  const handleDeleteRow = useCallback((index, row) => {
    if (!window.confirm(`Are you sure you want to delete ${row.id}`)) {
      return;
    }
    deleteArchive(row.id)
      .then(console.log)
      .catch(console.log)
      .finally(() => refreshList());
  }, [ rows ]);

  const refreshList = () => {
    let sessionId = session.id || null;
    if (sessionId) {
      listArchive(sessionId)
        .then(( items ) => {
          if (items) {
            setRows(items.filter(i => (i.status !== "expired")));
          } else {
            setRows([]);
          }
        }).catch(console.log);
    }
  };


  useEffect(() => {
    if (open) {
      refreshList();
      startTimer();
    }
    else if (!open) stopTimer();
  }, [open, isArchiving, startTimer, stopTimer]);

  useEffect(() => {
    return () => {
     if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
    }
  }, []);

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>{"Recordings(Archive API) "}</DialogTitle>
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
      <DialogContent dividers >
        {!rows.length? (
        <Typography gutterBottom sx={{fontSize: "small"}} >
          {"-"}
        </Typography> ) : (
        <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table">
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={row.id} >
                <TableCell align="left">{(new Date(row.createdAt)).toISOString().split(".")[0]}</TableCell>
                <TableCell align="left">{row.name}</TableCell>
                <TableCell align="left">{row.status}</TableCell>
                <TableCell align="left">
                  <Tooltip title="Stop Recording" arrow><span>
                    <IconButton color="warning" 
                      disabled={row.status !== "started"}
                      onClick={() => handleStopRow(index, row)}
                    >
                      <StopCircleIcon />
                    </IconButton></span>
                  </Tooltip></TableCell>
                <TableCell align="left">
                  <Tooltip title="Delete Recording" arrow><span>
                    <IconButton color="error" 
                      disabled={row.status !== "available"}
                      onClick={() => handleDeleteRow(index, row)} 
                    >
                      <DeleteIcon />
                    </IconButton></span>
                  </Tooltip> </TableCell>
                <TableCell align="left">
                  <Tooltip title="Download Recording" arrow><span>
                    <IconButton color="success" target="_blank" href={row.url}
                      disabled={row.status !== "available"}
                    >
                      <DownloadIcon />
                    </IconButton></span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={() => toggleOpen(false)}>{"Close"}</Button>
      </DialogActions>
    </Dialog>
  );
}