import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RadioButton, HelperText } from "react-native-paper";
import { colors, spacing, fonts } from "../../../theme";

const Radios = ({
  option,
  value,
  handleChange,
  hint,
  handleBlur,
  error,
  errorMessage,
}) => {
  if (!option || option.length === 0) {
    return null;
  }
  return (
    <View style={styles.container}>
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
      {hint ? (
        <Text style={[styles.text, { opacity: 0.5 }]}>{hint}</Text>
      ) : (
        false
      )}
      <HelperText type="error" visible={error} style={{ left: -10 }}>
        {errorMessage}
      </HelperText>
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
