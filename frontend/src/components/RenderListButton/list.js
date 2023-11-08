import { useRef, useContext, useState, useCallback, useEffect } from "react";
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
  IconButton,
  Button,
  Typography,
  Tooltip
} from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { RoomContext } from "../../context/RoomContext";
import { stopRender, listRender } from "../../api/render";

const refreshTimerInterval = 2000;

export const RenderList = ({ open, toggleOpen }) => {
  const {
    session,
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
    stopRender(row.id)
      .then(console.log)
      .catch(console.log)
      .finally(() => refreshList());
  }, [ rows ]);

  const refreshList = () => {
    let sessionId = session.id || null;
    if (sessionId) {
      listRender(sessionId)
        .then(( items ) => {
          if (items) {
            setRows(items.filter(i => (i.status === "started")));
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
  }, [open, startTimer, stopTimer]);

  useEffect(() => {
    return () => {
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
    }
  }, []);

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>Experience Composer List</DialogTitle>
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
                <TableCell align="left">{row.url}</TableCell>
                <TableCell align="left">{row.status}</TableCell>
                <TableCell align="left">
                  <Tooltip title="Stop" arrow><span>
                    <IconButton color="error" 
                      disabled={row.status !== "started"}
                      onClick={() => handleStopRow(index, row)}>
                      <CancelOutlinedIcon />
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
        <Button color="primary" onClick={() => toggleOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
