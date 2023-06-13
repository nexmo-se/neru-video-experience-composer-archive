
import useClasses from '../../hooks/useClasses';

export default function useStyles() {
  return useClasses({
    chatInput: {
      position: "absolute",
      bottom: "10px",
      width: "96%",
      padding: "2px",
      marginTop: "10px",
      // border: "1px solid red",
      maxHeight: "18%"
    }
  });
}
