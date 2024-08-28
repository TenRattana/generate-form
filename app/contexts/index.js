import React, { createContext } from "react";
import { colors, fonts, spacing } from "../../theme";
import Toast from "react-native-toast-message";

export const ThemeContext = createContext();
export const ThemeProvider = ({ children }) => {
  return (
    <ThemeContext.Provider value={{ colors, fonts, spacing }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const ToastContext = createContext();
export const ToastProvider = ({ children }) => {
  return (
    <ToastContext.Provider value={{ Toast }}>
      {children}
      <Toast />
    </ToastContext.Provider>
  );
};
