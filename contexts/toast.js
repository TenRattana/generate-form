import React, { createContext, useContext } from "react";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { colors, fonts, spacing } from "../theme";
import { StyleSheet, View, Text } from "react-native";

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
  success: ({ text1, text2 }) => (
    <BaseToast
      text1={text1}
      text2={text2}
      text1Style={[styles.text1Style, { color: colors.palette.green }]}
      text2Style={styles.text2Style}
      text2NumberOfLines={text2 ? text2.length : 0}
    />
  ),
  error: ({ text1, text2 }) => (
    <ErrorToast
      text1={text1}
      text2={text2}
      text1Style={[styles.text1Style, { color: colors.danger }]}
      text2Style={styles.text2Style}
      text2NumberOfLines={text2 ? text2.length : 0}
    />
  ),
  customToast: ({ text1, text2 }) => (
    <View style={styles.container}>
      <View>
        <Text style={styles.text1Style}>{text1}</Text>
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

export const ToastContext = createContext();
export const ToastProvider = ({ children }) => {
  return (
    <ToastContext.Provider value={{ Toast }}>
      {children}
      <Toast config={toastConfig} />
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
