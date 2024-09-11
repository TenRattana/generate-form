import React, { createContext, useContext, useState, useEffect } from "react";
import { Dimensions } from "react-native";

export const ResponsiveContext = createContext();

export const ResponsiveProvider = ({ children }) => {
  const [responsive, setResponsive] = useState("small");

  useEffect(() => {
    const updateLayout = () => {
      const { width } = Dimensions.get("window");
      if (width < 600) {
        setResponsive("small");
      } else if (width < 800) {
        setResponsive("medium");
      } else {
        setResponsive("large");
      }
    };

    updateLayout();

    const subscription = Dimensions.addEventListener("change", updateLayout);

    return () => {
      subscription?.remove();
    };
  }, []);

  return (
    <ResponsiveContext.Provider value={{ responsive }}>
      {children}
    </ResponsiveContext.Provider>
  );
};

export const useRes = () => useContext(ResponsiveContext);
