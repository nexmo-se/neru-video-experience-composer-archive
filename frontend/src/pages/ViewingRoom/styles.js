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
  });
}
