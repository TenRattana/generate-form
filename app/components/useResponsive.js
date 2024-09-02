import { useWindowDimensions } from "react-native";
import { useState, useEffect } from "react";

export function useResponsive() {
  const { width } = useWindowDimensions();
  const [responsive, setResponsive] = useState("small");

  console.log("useResponsive");

  useEffect(() => {
    if (width > 900) {
      setResponsive("large");
    } else if (width > 600) {
      setResponsive("medium");
    } else {
      setResponsive("small");
    }
  }, [width]);

  return responsive;
}
