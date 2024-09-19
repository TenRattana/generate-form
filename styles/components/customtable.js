import { StyleSheet } from "react-native";

const customtableStyle = ({ colors, spacing, fonts, responsive }) => {
  return StyleSheet.create({
    container: {
      width: responsive === "small" ? "100%" : "95%",
      alignSelf: "center",
      marginVertical: 10,
      backgroundColor: colors.background,
      overflow: "hidden",
    },
    head: {
      height: responsive === "small" ? 40 : responsive === "medium" ? 50 : 60,
      backgroundColor: colors.palette.primaryLight,
      borderBottomWidth: 2,
      borderBottomColor: colors.palette.primary,
      paddingVertical: responsive === "small" ? 5 : 10,
    },
    row: {
      height: responsive === "small" ? 50 : responsive === "medium" ? 60 : 70,
      borderBottomWidth: 1,
      borderBottomColor: colors.background,
      paddingVertical: responsive === "small" ? 5 : 10,
    },
    cardRow: {
      padding: spacing.md,
      marginVertical: spacing.sm,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: colors.border,
    },
    titleStyled: {
      color: colors.palette.danger,
      fontSize: fonts.xsm,
    },
    text: {
      fontSize: responsive === "small" ? fonts.sm : fonts.xsm,
      color: colors.text,
      textAlign: "left",
    },
    textHead: {
      fontSize: responsive === "small" ? fonts.sm : fonts.xsm,
      fontWeight: "bold",
      color: colors.text,
    },
    button: {
      paddingVertical: responsive === "small" ? spacing.xxs : spacing.xs,
      paddingHorizontal: responsive === "small" ? spacing.xxs : spacing.xs,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
    },
    booleanIcon: {
      fontSize: responsive === "small" ? 18 : 20,
      textAlign: "center",
    },
    noDataText: {
      alignSelf: "center",
      padding: 10,
      fontStyle: "italic",
      color: colors.text,
    },
    containerDialog: {
      width:
        responsive === "small"
          ? "80%"
          : responsive === "medium"
          ? "70%"
          : "60%",
      alignSelf: "center",
    },
    containerFlexStyle: {
      flexDirection: "row",
      flexWrap: "wrap",
      padding: 5,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonD: {
      width: `${
        responsive === "small" ? 98 : responsive === "medium" ? 80 / 2 : 75 / 4
      }%`,
      alignItems: "center",
      justifyContent: "center",
      marginVertical: "1%",
      marginHorizontal: "3%",
      textAlign: "center",
      height: 40,
      borderRadius: 10,
    },
    backMain: {
      backgroundColor: colors.main,
    },
    backSucceass: {
      backgroundColor: colors.succeass,
    },
    backDis: {
      backgroundColor: colors.disable,
    },
    textBold: {
      fontSize: responsive === "small" ? fonts.lg : fonts.lgx,
      fontWeight: "bold",
    },
    textMain: {
      color: colors.main,
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

export default customtableStyle;
