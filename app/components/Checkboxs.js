import React, { useState, useEffect } from "react";
import { CheckBox } from "@rneui/themed";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, fonts } from "../../theme";

const Checkboxs = ({ name, option, formData, handleChange }) => {
  const [checkedOptions, setCheckedOptions] = useState({});
  console.log("Checkboxs");

  useEffect(() => {
    const initialState = {};
    option.forEach((option) => {
      const isChecked = Array.isArray(formData[name])
        ? formData[name].includes(option.label)
        : false;
      initialState[option.label] = isChecked;
    });
    setCheckedOptions(initialState);
  }, [formData, option]);

  const handleCheckBoxChange = (value) => {
    const newCheckedOptions = {
      ...checkedOptions,
      [value]: !checkedOptions[value],
    };

    setCheckedOptions(newCheckedOptions);

    const selectedOptions = Object.keys(newCheckedOptions).filter(
      (key) => newCheckedOptions[key]
    );

    handleChange(name, selectedOptions);
  };

  if (!option || option.length === 0) {
    return null;
  }

  return option.map((option, LDetailID) => (
    <View key={LDetailID} style={styles.container}>
      <CheckBox
        checked={checkedOptions[option.label] || false}
        onPress={() => handleCheckBoxChange(option.label)}
        containerStyle={styles.checkboxContainer}
        textStyle={styles.checkboxText}
      />
      <Text style={styles.label}>{option.label}</Text>
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

export default Checkboxs;
