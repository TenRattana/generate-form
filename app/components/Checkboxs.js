import React, { useState, useEffect } from "react";
import { CheckBox } from "@rneui/themed";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, fonts } from "../../theme";

const Checkboxs = ({ field, formData, handleChange }) => {
  const [checkedOptions, setCheckedOptions] = useState({});

  useEffect(() => {
    const initialState = {};
    field.MatchQuestionOptions.forEach(option => {
      const isChecked = Array.isArray(formData[field.MQuestionID])
        ? formData[field.MQuestionID].includes(option.OptionName)
        : false;
      initialState[option.OptionName] = isChecked;
    });
    setCheckedOptions(initialState);
  }, [formData, field]);

  const handleCheckBoxChange = (optionName) => {
    const newCheckedOptions = { ...checkedOptions, [optionName]: !checkedOptions[optionName] };

    setCheckedOptions(newCheckedOptions);

    const selectedOptions = Object.keys(newCheckedOptions).filter(
      key => newCheckedOptions[key]
    );
    
    handleChange(field.MQuestionID, selectedOptions, "CHECKBOX");
  };

  if (!field.MatchQuestionOptions || field.MatchQuestionOptions.length === 0) {
    return null;
  }

  return field.MatchQuestionOptions.map((option, OptionID) => (
    <View key={OptionID} style={styles.container}>
      <CheckBox
        checked={checkedOptions[option.OptionName] || false}
        onPress={() => handleCheckBoxChange(option.OptionName)}
        containerStyle={styles.checkboxContainer}
        textStyle={styles.checkboxText}
      />
      <Text style={styles.label}>{option.OptionName}</Text>
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
