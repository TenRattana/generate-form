import React from "react";
import { TextInput, View, StyleSheet } from "react-native";
import { colors, spacing, fonts } from "../../theme";

const Inputs = ({ field, formData, handleChange }) => (
  <View style={styles.container}>
    <TextInput
      placeholder={field.placeholder}
      name={field.QuestionName}
      onChangeText={(value) => handleChange(field.MQuestionID, value)}
      value={formData[field.MQuestionID] || ""}
      style={styles.textInput}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  textInput: {
    borderColor: colors.border,
    borderWidth: 1,
    padding: spacing.xxs,
    fontSize: fonts.body,
    borderRadius: 5,
    backgroundColor: colors.background,
  },
});

export default Inputs;
