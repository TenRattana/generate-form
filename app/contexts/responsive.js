import React, { createContext, useContext, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const ResponsiveContext = createContext();
export const ResponsiveProvider = ({ children }) => {
  const [responsive, setResponsive] = useState("small");

  return (
    <ResponsiveContext.Provider value={{ responsive }}>
      {children}
    </ResponsiveContext.Provider>
  );
};

export const useRes = () => useContext(ResponsiveContext);
