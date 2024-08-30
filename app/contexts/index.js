import React, { createContext } from "react";
import { colors, fonts, spacing } from "../../theme";
import { StyleSheet, View, Text } from "react-native";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: colors.palette.light,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.palette.dark4,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: spacing.sm,
  },
  text1Style: {
    fontSize: fonts.md,
    color: colors.palette.dark,
    fontWeight: "bold",
  },
  text2Style: {
    fontSize: fonts.sm,
    color: colors.palette.gray90,
  },
});

const toastConfig = {
  success: () => (
    <BaseToast
      text1Style={[styles.text1Style, { color: colors.palette.green }]}
      text1NumberOfLines={2}
      text2Style={styles.text2Style}
      text2NumberOfLines={2}
    />
  ),
  error: () => (
    <ErrorToast
      text1Style={[styles.text1Style, { color: colors.danger }]}
      text1NumberOfLines={2}
      text2Style={styles.text2Style}
      text2NumberOfLines={2}
    />
  ),
  customToast: ({ text1, text2, props }) => (
    <View style={styles.container}>
      <View>
        <Text style={[styles.text1Style, { color: props.color }]}>{text1}</Text>
        {text2 &&
          text2.map((element, index) => (
            <Text key={index} style={styles.text2Style}>
              {element}
            </Text>
          ))}
      </View>
    </View>
  ),
};

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
      <Toast config={toastConfig} />
    </ToastContext.Provider>
  );
};
