import React from "react";
import { Picker } from "@react-native-picker/picker";
import { View, StyleSheet, Text } from "react-native";
import { colors, spacing, fonts } from "../../../theme";

const Selects = ({ hint, name, option, formData, handleChange }) => {
  if (!option || option.length === 0) {
    return "";
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{hint}</Text>
      <View style={styles.dropdown}>
        <Picker
          selectedValue={formData[name]}
          onValueChange={(value) => handleChange(name, value)}
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
      {hint ? <Text style={styles.label}>{hint}</Text> : null}
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
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
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
});

export default Selects;
