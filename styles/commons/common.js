import { StyleSheet } from "react-native";

const commonStyle = ({ colors, spacing, fonts, responsive }) => {
  return StyleSheet.create({
    container: {
      marginVertical: spacing.xxs,
      marginHorizontal: spacing.sm,
    },
    text: {
      fontSize: responsive === "small" ? fonts.sm : fonts.xsm,
      color: colors.text,
      textAlign: "left",
    },
    textBold: {
      fontSize: responsive === "small" ? fonts.lg : fonts.lgx,
      fontWeight: "bold",
    },
    textMain: {
      color: colors.main,
    },
    testDis: {
      color: colors.disable,
    },
    textLight: {
      color: colors.light,
    },
    textDark: {
      color: colors.dark,
    },
    textError: {
      color: colors.danger,
    },
  });
};

export default commonStyle;
