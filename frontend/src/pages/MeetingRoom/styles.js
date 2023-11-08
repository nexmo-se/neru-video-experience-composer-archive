import useClasses from "../../hooks/useClasses";

export default function useStyles() {
  return useClasses({
    videoContainer: {
      width: "100%",
      maxWidth: "100vw",
      height: "100vh",
      maxHeight: "100vh",
      backgroundColor: "rgba(0, 0, 0, .4)",
    },
    publisherContainer: {
      width: "320px",
      height: "240px",
    }, 
    controlToolbarContainer: {
      position: "absolute",
      bottom: 10,
      left: "calc(50% - 160px)",
      transform: "translate(-50%, 0)",
      width: "calc(100vw - 320px)",
      height: "50px",
      display: "flex",
      flexDirection: "row",
      flexWrap: "nowrap",
      alignContent: "center",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 10,
    }
  });
}
