import { useMemo } from "react";
import { css } from "@emotion/css";

export default function useClasses(styles) {
  return useMemo(() => {
    const rawClasses = styles;
    
    const prepared = {};
    Object.entries(rawClasses).forEach(([key, value = {}]) => {
      prepared[key] = css(value);
    });
    
    return prepared;
  }, [styles]);
}
