import React from "react";
import { StyleSheet, useWindowDimensions } from "react-native";

const formStyles = ({ colors, spacing, fonts, responsive }) => {
  const { width } = useWindowDimensions();
  console.log("Form");

  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: responsive === "small" ? "column" : "row",
      flexWrap: responsive === "small" ? "nowrap" : "wrap",
    },
    layout1: {
      padding: 10,
      width: responsive === "small" ? "100%" : 400,
      backgroundColor: colors.palette.dark4,
    },
    layout2: {
      padding: 10,
      width: responsive === "small" ? "100%" : width - 400,
    },
    cardshow: {
      marginTop: 30,
      marginVertical: 10,
      marginHorizontal: 15,
      padding: 10,
    },
    card: {
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
      padding: 10,
      backgroundColor: colors.palette.background2,
      textAlign: "center",
      borderRadius: 4,
      marginBottom: 5,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    textHeader: {
      fontSize: responsive === "small" ? fonts.xmd : fonts.lg,
      fontWeight: "bold",
      marginLeft: 20,
      paddingTop: 10,
      color: colors.palette.light,
    },
    containerInput: {
      backgroundColor: "darkgray",
      marginVertical: spacing.md,
    },
    containerButton: {
      alignSelf: "center",
      width: "90%",
      marginVertical: "1%",
      marginHorizontal: "2%",
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
      fontSize:
        responsive === "small"
          ? fonts.xsm
          : responsive === "medium"
          ? fonts.sm
          : fonts.xsm,
      color: colors.palette.light,
    },
    sectionHead: {
      fontSize: 24,
      fontWeight: "bold",
      alignSelf: "center",
      marginVertical: 5,
      marginBottom: 20,
    },
  });
};

export default formStyles;
