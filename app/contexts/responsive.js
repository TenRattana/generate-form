import React, { createContext, useContext } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const ResponsiveContext = createContext();
export const ResponsiveProvider = ({ children }) => {
  const responsive = {
    widthPercentage: wp,
    heightPercentage: hp,
  };

  return (
    <ResponsiveContext.Provider value={{ responsive }}>
      {children}
    </ResponsiveContext.Provider>
  );
};

export const useResponsive = () => useContext(ResponsiveContext);
