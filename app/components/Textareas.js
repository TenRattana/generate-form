import React from "react";
import { TextInput, View, StyleSheet } from "react-native";
import { colors, spacing, fonts } from "../../theme";

const Textareas = ({ field, formData, handleChange }) => (
  <View style={styles.container}>
    <TextInput
      placeholder={field.placeholder}
      name={field.QuestionName}
      onChangeText={(value) => handleChange(field.MQuestionID, value)}
      value={formData[field.QuestionName] || ""}
      multiline
      numberOfLines={4}
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
    padding: spacing.md,
    fontSize: fonts.body,
    borderRadius: 5,
    backgroundColor: colors.background,
  },
});

export default Textareas;
