import { grey } from "@mui/material/colors";

import useClasses from "../../hooks/useClasses";

export default function useStyles() {
  return useClasses({
    hidden: {
      display: "none !important",
    },
    controlToolbar: {
      backgroundColor: grey[600],
      position: "relative",
      paddingTop: "5px",
      paddingLeft: "20px",
      borderRadius: "5px",
      transition: "all 0.8s ease-in",
    },
  });
}
