
import useClasses from "../../hooks/useClasses";

export default function useStyles() {
  return useClasses({
    waitingRoomVideoPreview: {
      width: "320px",
      height: "240px",
      margin: "10px 0",
    }
  });
}