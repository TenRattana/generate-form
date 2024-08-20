import React from "react";
import { Picker } from "@react-native-picker/picker";
import { View, StyleSheet } from "react-native";
import { colors, spacing, fonts } from "../../theme";

const Selects = ({ field, formData, handleChange }) => {
  if (!field.MatchQuestionOptions || field.MatchQuestionOptions.length === 0) {
    return "";
  }

  return (
    <View style={styles.dropdown}>
      <Picker
        selectedValue={formData[field.MQuestionID]}
        onValueChange={(value) => handleChange(field.MQuestionID, value)}
        style={styles.picker}
      >
        <Picker.Item label="Select..." value="" />
        {field.MatchQuestionOptions.map((option, OptionID) => (
          <Picker.Item
            key={OptionID}
            label={option.OptionName}
            value={option.OptionName}
          />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    marginVertical: spacing.sm,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: colors.background,
  },
  picker: {
    height: 50,
    width: "100%",
  },
});

export default Selects;
