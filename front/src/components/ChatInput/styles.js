
import useClasses from '../../hooks/useClasses';

export default function useStyles() {
  return useClasses({
    chatInput: {
      position: "absolute",
      bottom: 10,
      width: "100%",
    }
  });
}
