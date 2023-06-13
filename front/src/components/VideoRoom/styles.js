
import useClasses from '../../hooks/useClasses';

export default function useStyles() {
  return useClasses({
    container: {
      display: "flex",
      flexDirection: "row",
    },
    videoContainer: {
      width: "calc(100vw - 23vw)",
      height: "100vh",
    },
    fullWidth: {
      width: "100vw",
    },
    chatContainer: {
      position: "absolute",
      right: "3px",
      top: "3vh",
      bottom: "2vh",
      width: "22vw",
      // maxWidth: "22vw",
      height: "92vh",
      backgroundColor: "#e7e7e7",
      zIndex: "1000",
      display: "none",
      textAlign: "left",
      borderRadius: "10px",
      overflowX: "hidden"
    },
    visible: {
      display: "block",
    },
    controlToolbar: {
      position: "absolute",
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      width: "100vw",
      height: "50px",
      bottom: 10,
      left: "50%",
      transform: "translate(-50%)",
      zIndex: 10,
    },
    left40: {
      left: "40%",
    }
  });
}
