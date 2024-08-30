import React, { useState, useEffect } from "react";
import { CheckBox } from "@rneui/themed";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, fonts } from "../../theme";

const Checkboxs = ({ field, formData, handleChange }) => {
  const [checkedOptions, setCheckedOptions] = useState({});

  useEffect(() => {
    const initialState = {};
    field.MatchListDetail.forEach((option) => {
      const isChecked = Array.isArray(formData[field.mListId])
        ? formData[field.mListId].includes(option.ListName)
        : false;
      initialState[option.ListName] = isChecked;
    });
    setCheckedOptions(initialState);
  }, [formData, field]);

  const handleCheckBoxChange = (ListName) => {
    const newCheckedOptions = {
      ...checkedOptions,
      [ListName]: !checkedOptions[ListName],
    };

    setCheckedOptions(newCheckedOptions);

    const selectedOptions = Object.keys(newCheckedOptions).filter(
      (key) => newCheckedOptions[key]
    );

    handleChange(field.mListId, selectedOptions, "CHECKBOX");
  };

  if (!field.MatchListDetail || field.MatchListDetail.length === 0) {
    return null;
  }

  return field.MatchListDetail.map((option, LDetailID) => (
    <View key={LDetailID} style={styles.container}>
      <CheckBox
        checked={checkedOptions[option.ListName] || false}
        onPress={() => handleCheckBoxChange(option.ListName)}
        containerStyle={styles.checkboxContainer}
        textStyle={styles.checkboxText}
      />
      <Text style={styles.label}>{option.ListName}</Text>
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
