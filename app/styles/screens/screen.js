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
      color: colors.text,
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
      backgroundColor: "darkgray",
      marginVertical: spacing.md,
    },
    errorText: {
      fontSize:
        responsive === "small"
          ? fonts.xsm
          : responsive === "medium"
          ? fonts.sm
          : fonts.md,
      marginLeft: spacing.xs,
      top: -spacing.xxs,
      color: colors.danger,
    },
    containerFlexStyle: {
      flexDirection: "row",
      flexWrap: "wrap",
      padding: 5,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonStyle: {
      flexBasis: `${
        responsive === "small" ? 98 : responsive === "medium" ? 80 / 2 : 75 / 4
      }%`,
      backgroundColor: "#DDDDDD",
      borderRadius: 5,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      marginVertical: "1%",
      marginHorizontal: "3%",
      textAlign: "center",
    },
    flexRes: {},
    flexResScreen: {
      flexBasis: `${
        responsive === "small" ? 98 : responsive === "medium" ? 80 / 2 : 75 / 4
      }%`,
    },
  });
};

export default screenStyles;
