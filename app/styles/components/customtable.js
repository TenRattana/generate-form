import { StyleSheet } from "react-native";

const customtableStyle = ({ colors, spacing, fonts, responsive }) => {
  return StyleSheet.create({
    containerTable: {
      width: responsive === "small" ? "100%" : "95%",
      alignSelf: "center",
      marginVertical: 10,
      borderRadius: 10,
    },
    head: {
      height: responsive === "small" ? 40 : responsive === "medium" ? 50 : 60,
      borderBottomWidth: 2,
    },
    headerCell: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: spacing.sm,
    },
    row: {
      flexDirection: "row",
      height: responsive === "small" ? 60 : responsive === "medium" ? 50 : 60,
      borderBottomWidth: 1,
      borderColor: colors.background,
    },
    cardRow: {
      padding: spacing.md,
      marginVertical: spacing.sm,
      borderRadius: 5,
      borderWidth: 1,
    },
    titleStyled: {
      color: colors.palette.danger,
      fontSize:
        responsive === "small"
          ? fonts.xsm
          : responsive === "medium"
          ? fonts.sm
          : fonts.xsm,
    },
    titleStylew: {
      color: colors.palette.primaryLight,
      fontSize:
        responsive === "small"
          ? fonts.xsm
          : responsive === "medium"
          ? fonts.sm
          : fonts.xsm,
    },
    text: {
      fontSize:
        responsive === "small"
          ? fonts.xsm
          : responsive === "medium"
          ? fonts.sm
          : fonts.xsm,
      color: colors.text,
      alignSelf: responsive === "small" ? "flex-start" : "center",
    },
    textHead: {
      fontSize:
        responsive === "small"
          ? fonts.xsm
          : responsive === "medium"
          ? fonts.sm
          : fonts.xsm,
      fontWeight: "bold",
      color: colors.text,
      alignSelf: responsive === "small" ? "flex-start" : "center",
    },
    button: {
      paddingVertical:
        responsive === "small"
          ? spacing.sm
          : responsive === "medium"
          ? spacing.md
          : spacing.lg,
      paddingHorizontal:
        responsive === "small"
          ? spacing.md
          : responsive === "medium"
          ? spacing.lg
          : spacing.xl,
      alignItems: "center",
      justifyContent: "center",
      userSelect: "none",
    },
    booleanText: {
      fontSize: fonts.sm,
      color: colors.text,
    },
    booleanIcon: {
      fontSize: 20,
      textAlign: "center",
    },
    iconStatus: {
      flexDirection: "row",
      alignItems: "center",
      flexBasis: "40%",
    },
  });
};

export default customtableStyle;
