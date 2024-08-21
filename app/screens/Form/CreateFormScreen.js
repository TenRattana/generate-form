import { StyleSheet, ScrollView, Text, View } from "react-native";
import React from "react";
import { useResponsive } from "../../components";
import { colors, spacing, fonts } from "../../../theme";
import { Button, Card, Input } from "@rneui/themed";

export default function CreateFormScreen() {
  const responsive = useResponsive();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      flex: 1,
      padding: spacing.md,
      flexDirection: "row",
      justifyContent: "space-between",
      flexWrap: "wrap",
    },
    toolContainer: {
      width:
        responsive === "small" ? "100%" : responsive === "medium" ? "35%" : 300,
      padding: spacing.sm,
      marginBottom: spacing.sm,
    },
    fieldConainer: {
      marginBottom: spacing.md,
      borderRadius: spacing.sm,
    },
    formContainer: {
      width:
        responsive === "small"
          ? "100%"
          : responsive === "medium"
          ? "60%"
          : "70%",
      padding: spacing.sm,
    },
    containerButton: {
      flexDirection: responsive === "large" ? "row" : "column",
      marginVertical: "1%",
      marginHorizontal: "2%",
      borderBottomWidth: 1,
      borderColor: colors.palette.light,
    },
    text: {
      fontSize: responsive === "small" ? fonts.sm : fonts.xsm,
      color: colors.text,
    },
  });

  return (
    <ScrollView>
      <Text>CreateFormScreen</Text>
      <View style={styles.container}>
        <View style={styles.toolContainer}>
          <Text>Field</Text>
          <View style={styles.fieldConainer}>
            <Button
              title="Field Name"
              containerStyle={styles.containerButton}
              titleStyle={styles.text}
              color={colors.palette.light}
            />
            <Button
              title="Email"
              containerStyle={styles.containerButton}
              titleStyle={styles.text}
            />
          </View>

          <Button
            title="Header"
            containerStyle={styles.containerButton}
            titleStyle={styles.text}
          />
          <Button
            title="Submit Button"
            containerStyle={styles.containerButton}
            titleStyle={styles.text}
          />
          <Text>Generate</Text>
        </View>
        <View style={styles.formContainer}>
          <Text>View Form</Text>
        </View>
      </View>
    </ScrollView>
  );
}
