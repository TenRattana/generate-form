import React from "react";
import { TextInput, View, StyleSheet, Text } from "react-native";
import { colors, spacing, fonts } from "../../theme";

const Inputs = ({ placeholder, hint, label, name, formData, handleChange }) => {
  console.log("Inputs");

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder || ""}
        name={label || ""}
        onChangeText={(value) => handleChange(name, value)}
        value={formData[name] || ""}
        style={styles.textInput}
      />
      {hint ? <Text style={styles.label}>{hint}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  textInput: {
    borderColor: colors.border,
    borderWidth: 1,
    padding: spacing.xs,
    fontSize: fonts.xsm,
    borderRadius: 5,
    backgroundColor: colors.background,
  },
  label: {
    fontSize: fonts.xsm,
    marginLeft: spacing.xxs,
    marginTop: spacing.xs,
    color: colors.palette.gray90,
  },
});

export default Inputs;
