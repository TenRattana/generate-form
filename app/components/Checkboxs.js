import React from "react";
import { CheckBox } from "@rneui/themed";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, fonts } from "../../theme";

const Checkboxs = ({ field, formData, handleChange }) => {
  return (
    <View style={styles.container}>
      <CheckBox
        checked={formData[field.MQuestionID] || false}
        onPress={() =>
          handleChange(
            field.MQuestionID,
            !formData[field.MQuestionID],
            "checkbox"
          )
        }
        containerStyle={styles.checkboxContainer}
        textStyle={styles.checkboxText}
        title={field.QuestionName}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  checkboxContainer: {
    backgroundColor: colors.transparent,
    borderWidth: 0,
  },
  checkboxText: {
    fontSize: fonts.body,
    color: colors.text,
  },
});

export default Checkboxs;
