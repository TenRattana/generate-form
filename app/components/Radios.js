import React from "react";
import { CheckBox } from "@rneui/themed";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, fonts } from "../../theme";

const Radios = ({ field, formData, handleChange }) => {
  if (!field.MatchQuestionOptions || field.MatchQuestionOptions.length === 0) {
    return "";
  }

  return field.MatchQuestionOptions.map((option, OptionID) => (
    <View key={OptionID} style={styles.container}>
      <CheckBox
        checked={formData[field.MQuestionID] === option.OptionName}
        onPress={() => handleChange(field.MQuestionID, option.OptionName)}
        containerStyle={styles.checkboxContainer}
        textStyle={styles.checkboxText}
      />
      <Text style={styles.label}>{option.OptionName}</Text>
    </View>
  ));
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing.xxxs,
  },
  checkboxContainer: {
    backgroundColor: colors.transparent,
    borderWidth: 0,
    marginRight: spacing.sm,
  },
  checkboxText: {
    fontSize: fonts.body,
    color: colors.text,
  },
  label: {
    fontSize: fonts.body,
    color: colors.text,
  },
});

export default Radios;
