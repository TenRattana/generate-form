import React from "react";
import { StyleSheet, useWindowDimensions } from "react-native";

const formStyles = ({ colors, spacing, fonts, responsive }) => {
  const { width } = useWindowDimensions();
  console.log("Form");

  return StyleSheet.create({
    contentContainer: {
      height: 600,
    },
    container: {
      flex: 1,
      flexDirection: responsive === "small" ? "column" : "row",
      flexWrap: responsive === "small" ? "nowrap" : "wrap",
    },
    layout1: {
      display: "flex",
      padding: 10,
      width: responsive === "small" ? "100%" : 400,
      backgroundColor: colors.main,
    },
    layout2: {
      display: "flex",
      flex: 1,
      margin: 10,
    },
    cardshow: {
      marginTop: 30,
      marginVertical: 10,
      marginHorizontal: 15,
      padding: 10,
    },
    card: {
      display: "flex",
      marginTop: 30,
      marginVertical: 10,
      marginHorizontal: 15,
      padding: 10,
      backgroundColor: "#fff",
      borderRadius: 8,
      elevation: 2,
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.8)",
    },
    cardTitle: {
      marginVertical: 10,
      marginHorizontal: 10,
      fontSize: 18,
      fontWeight: "bold",
    },
    formContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    fieldContainer: {
      margin: 5,
    },
    dialogContainer: {
      padding: 20,
      width: responsive === "small" || responsive === "medium" ? "90%" : 650,
    },
    viewDialog: {
      paddingTop: 30,
    },
    button: {
      display: "flex",
      height: 45,
      alignItems: "center",
      justifyContent: "center",
      marginVertical: "1%",
      marginHorizontal: "3%",
      borderRadius: 10,
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
    backSucceass: {
      backgroundColor: colors.succeass,
    },
    textHeader: {
      fontSize: responsive === "small" ? fonts.xmd : fonts.lg,
      fontWeight: "bold",
      marginLeft: 10,
      color: colors.palette.light,
      marginBottom: 20,
    },
    containerInput: {
      backgroundColor: "darkgray",
      marginVertical: spacing.md,
    },
    containerButton: {
      display: "flex",
      alignSelf: "center",
      width: "90%",
      marginVertical: "1%",
      marginHorizontal: "2%",
      justifyContent: "flex-start",
    },
    section: {
      padding: "2%",
      borderRadius: 5,
      backgroundColor: "white",
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
    },
    errorText: {
      fontSize:
        responsive === "small"
          ? fonts.xsm
          : responsive === "medium"
          ? fonts.sm
          : fonts.xsm,
      marginLeft: spacing.xs,
      top: -spacing.xxs,
      color: colors.danger,
    },
    text: {
      fontSize: responsive === "small" ? fonts.xsm : fonts.md,
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
    textLight: {
      color: colors.light,
    },
    textDark: {
      color: colors.dark,
    },
    textError: {
      color: colors.danger,
    },
    sectionHead: {
      fontSize: 24,
      fontWeight: "bold",
      alignSelf: "center",
      marginVertical: 5,
      marginBottom: 20,
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
    bwidth: {
      width: `${
        responsive === "small" ? 98 : responsive === "medium" ? 40 : 30
      }%`,
    },
  });
};

export default formStyles;
