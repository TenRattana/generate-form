import { StyleSheet } from "react-native";

const screenStyles = ({ colors, spacing, fonts, responsive }) => {
  return StyleSheet.create({
    scrollView: {
      flex: 1,
    },
    text: {
      fontSize:
        responsive === "small"
          ? fonts.xsm
          : responsive === "medium"
          ? fonts.sm
          : fonts.xsm,
    },
    textBold: {
      fontSize: responsive === "small" ? fonts.xmd : fonts.lg,
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
    buttonContainer: {
      flexDirection: responsive === "large" ? "row" : "column",
      justifyContent: "center",
      alignItems: "center",
    },
    containerButton: {
      width: "100%",
      marginVertical: "1%",
      marginHorizontal: "2%",
    },
    containerInput: {
      backgroundColor: colors.palette.gray90,
      marginVertical: spacing.md,
    },
    errorText: {
      fontSize:
        responsive === "small"
          ? fonts.xsm
          : responsive === "medium"
          ? fonts.sm
          : fonts.md,
    },
    containerFlexStyle: {
      flexDirection: "row",
      flexWrap: "wrap",
      padding: 5,
      alignItems: "center",
      justifyContent: "center",
    },
    button: {
      width: `${
        responsive === "small" ? 98 : responsive === "medium" ? 80 / 2 : 75 / 4
      }%`,
      alignItems: "center",
      justifyContent: "center",
      marginVertical: "1%",
      marginHorizontal: "3%",
      textAlign: "center",
      height: 40,
    },
    backMain: {
      backgroundColor: colors.main,
    },
    backLight: {
      backgroundColor: colors.palette.light,
    },
    backDis: {
      backgroundColor: colors.disable,
    },
    flexRes: {},
    flexResScreen: {
      flexBasis: `${
        responsive === "small" ? 98 : responsive === "medium" ? 80 / 2 : 75 / 4
      }%`,
    },
    dialogContainer: {
      padding: 20,
      width: responsive === "small" || responsive === "medium" ? "90%" : 650,
    },
    textHeader: {
      fontWeight: "bold",
      marginLeft: 10,
      color: colors.palette.light,
      marginBottom: 20,
    },
  });
};

export default screenStyles;
