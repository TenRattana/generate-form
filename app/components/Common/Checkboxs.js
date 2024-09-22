import React, { useEffect, useState } from "react";
import { Checkbox } from "react-native-paper";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, fonts } from "../../../theme";

const Checkboxs = ({ name, option, formData, handleChange, handleBlur, hint, error, errorMessage }) => {
  const [checkedOptions, setCheckedOptions] = useState([]);

  useEffect(() => {
    setCheckedOptions(formData[name] || []);
  }, [formData, name]);

  const handleCheckBoxChange = (value) => {
    const newCheckedOptions = checkedOptions.includes(value)
      ? checkedOptions.filter((item) => item !== value)
      : [...checkedOptions, value];

    setCheckedOptions(newCheckedOptions);
    handleChange(name, newCheckedOptions);
  };

  if (!option || option.length === 0) {
    return null;
  }

  return (
    <View>
      {hint && <Text style={styles.hint}>{hint}</Text>}
      {option.map((item, index) => (
        <View key={index} style={styles.container}>
          <Checkbox
            status={checkedOptions.includes(item.label) ? 'checked' : 'unchecked'}
            onPress={() => handleCheckBoxChange(item.label)}
          />
          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}
      {error && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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

export default Checkboxs;
