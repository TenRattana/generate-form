import React from "react";
import { Picker } from "@react-native-picker/picker";
import { View, StyleSheet, Text } from "react-native";
import { colors, spacing, fonts } from "../../../theme";

const Selects = ({ hint, name, option, formData, handleChange }) => {
  if (!option || option.length === 0) {
    return "";
  }
  console.log("Selects");

  return (
    <View style={styles.container}>
      <View style={styles.dropdown}>
        <Picker
          selectedValue={formData[name]}
          onValueChange={(value) => handleChange(name, value)}
          style={styles.picker}
        >
          <Picker.Item label="Select..." value="" />
          {option.map((option, value) => (
            <Picker.Item
              key={`${value}`}
              label={option.label}
              value={option.label}
            />
          ))}
        </Picker>
      </View>
      {hint ? <Text style={styles.label}>{hint}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  dropdown: {
    marginVertical: spacing.sm,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: colors.background,
  },
  picker: {
    height: 40,
    width: "100%",
  },
  label: {
    fontSize: fonts.xsm,
    marginLeft: spacing.xxs,
    color: colors.palette.gray90,
  },
});

export default Selects;
