import { StyleSheet } from "react-native";

const componentStyles = ({ colors, spacing, fonts, responsive }) => {
  return StyleSheet.create({
    container: {
      marginVertical: spacing.sm,
    },
    textInput: {
      borderColor: colors.border,
      borderWidth: 1,
      padding: spacing.md,
      fontSize: fonts.body,
      borderRadius: 5,
      backgroundColor: colors.background,
    },
    label: {
      fontSize: fonts.xsm,
      marginLeft: spacing.xxs,
      marginTop: spacing.xs,
      color: colors.palette.gray90,
    },
    dropdown: {
      marginVertical: spacing.sm,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 5,
      backgroundColor: colors.background,
    },
    picker: {
      height: 40,
      width: "100%",
    },
    label: {
      fontSize: fonts.xsm,
      marginLeft: spacing.xxs,
      color: colors.palette.gray90,
    },
    containerSelect: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: spacing.xxxs,
    },
    checkboxContainer: {
      backgroundColor: colors.transparent,
      borderWidth: 0,
      marginRight: spacing.sm,
    },
    checkboxText: {
      fontSize: fonts.body,
      color: colors.text,
    },
    label: {
      fontSize: fonts.body,
      color: colors.text,
    },
    textInput: {
      borderColor: colors.border,
      borderWidth: 1,
      padding: spacing.xs,
      fontSize: fonts.xsm,
      borderRadius: 5,
      backgroundColor: colors.background,
    },
    label: {
      fontSize: fonts.xsm,
      marginLeft: spacing.xxs,
      marginTop: spacing.xs,
      color: colors.palette.gray90,
    },
    checkboxText: {
      fontSize: fonts.body,
      color: colors.text,
    },
    label: {
      fontSize: fonts.body,
      color: colors.text,
    },
  });
};

export default componentStyles;
