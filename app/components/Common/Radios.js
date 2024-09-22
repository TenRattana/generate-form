import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RadioButton } from "react-native-paper";
import { colors, spacing, fonts } from "../../../theme";

const Radios = ({ option, value, handleChange, hint, handleBlur, error, errorMessage }) => {
  return (
    <View style={styles.container}>
      {hint && <Text style={styles.hint}>{hint}</Text>} 
      <RadioButton.Group
        onValueChange={(newValue) => handleChange("matchCheckListId", newValue)}
        value={value}
      >
        {option.map((opt, index) => (
          <View key={index} style={styles.radioContainer}>
            <RadioButton value={opt.label} />
            <Text style={styles.label}>{opt.label}</Text>
          </View>
        ))}
      </RadioButton.Group>
      {error && <Text style={styles.errorText}>{errorMessage}</Text>} 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing.xxxs,
  },
  label: {
    fontSize: fonts.body,
    color: colors.text,
  },
  hint: {
    fontSize: fonts.sm,
    marginBottom: spacing.xs,
    color: colors.palette.gray90,
  },
  errorText: {
    fontSize: fonts.sm,
    color: colors.error,
  },
});

export default Radios;
