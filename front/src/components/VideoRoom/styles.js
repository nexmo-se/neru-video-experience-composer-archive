
import useClasses from '../../hooks/useClasses';

export default function useStyles() {
  return useClasses({
    container: {
      display: "flex",
      flexDirection: "row",
    },
    videoContainer: {
      width: "calc(100vw - 22vw)",
      height: "100vh",
    },
    fullWidth: {
      width: "100vw",
    },
    chatContainer: {
      position: "absolute",
      right: "1vw",
      top: "2vh",
      bottom: "2vh",
      width: "20vw",
      maxWidth: "50%",
      height: "96vh",
      backgroundColor: "#e7e7e7",
      zIndex: "1000",
      display: "none",
      textAlign: "left",
      padding: "5px"
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
