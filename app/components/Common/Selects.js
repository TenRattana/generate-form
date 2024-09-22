import React from "react";
import { Picker } from "@react-native-picker/picker";
import { View, StyleSheet, Text } from "react-native";
import { colors, spacing, fonts } from "../../../theme";

const Selects = ({ hint, option, value, handleChange, handleBlur, error, errorMessage }) => {
  if (!option || option.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {hint && <Text style={styles.label}>{hint}</Text>}
      <View style={styles.dropdown}>
        <Picker
          selectedValue={value} 
          onValueChange={(selectedValue) => handleChange(selectedValue)}
          onBlur={handleBlur}
          style={styles.picker}
          itemStyle={styles.itemStyle}
        >
          <Picker.Item label="Select..." value="" />
          {option.map((item, index) => (
            <Picker.Item
              key={`value-${index}`}
              label={item.label}
              value={item.value}
            />
          ))}
        </Picker>
      </View>
      {error && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  dropdown: {
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: colors.background,
    elevation: 5,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  itemStyle: {
    height: 50,
    backgroundColor: colors.background,
  },
  label: {
    fontSize: fonts.sm,
    marginBottom: spacing.xs,
    color: colors.palette.gray90,
  },
  errorText: {
    fontSize: fonts.sm,
    color: colors.error,
  },
});

export default Selects;
