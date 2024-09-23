import React, { useEffect, useState } from "react";
import { Checkbox, HelperText } from "react-native-paper";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, fonts } from "../../../theme";

const Checkboxs = ({
  option,
  value,
  handleChange,
  hint,
  handleBlur,
  error,
  errorMessage,
}) => {
  const [checkedOptions, setCheckedOptions] = useState([]);

  useEffect(() => {
    setCheckedOptions(value || []);
  }, [value]);

  const handleCheckBoxChange = (value) => {
    const newCheckedOptions = checkedOptions.includes(value)
      ? checkedOptions.filter((item) => item !== value)
      : [...checkedOptions, value];

    setCheckedOptions(newCheckedOptions);
    handleChange(newCheckedOptions);
  };

  if (!option || option.length === 0) {
    return null;
  }

  return (
    <View>
      {option.map((item, index) => (
        <View key={index} style={styles.container}>
          <Checkbox
            status={
              checkedOptions.includes(item.label) ? "checked" : "unchecked"
            }
            onPress={() => handleCheckBoxChange(item.label)}
          />
          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}

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
