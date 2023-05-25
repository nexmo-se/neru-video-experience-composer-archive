import useClasses from '../../hooks/useClasses';

export default function useStyles() {
  return useClasses({
    videoContainer: {
      width: "100vw",
      height: "100vh",
      display: "flex",
      flexDirection: "row",
    },
    controlToolbar: {
      position: "absolute",
      bottom: 10,
      display: "flex",
      flexDirection: "row",
      left: "50%",
      transform: "translate(-50%)",
      zIndex: 10,
      height: "50px",
      width: "100vw",
      justifyContent: "center",
    },
  });
}
