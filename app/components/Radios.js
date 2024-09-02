import React from "react";
import { CheckBox } from "@rneui/themed";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, fonts } from "../../theme";

const Radios = ({ name, option, formData, handleChange }) => {
  if (!option || option === 0) {
    return "";
  }
  console.log("Radios");

  return option.map((option, index) => (
    <View key={index} style={styles.container}>
      <CheckBox
        checked={formData[name] === option.label}
        onPress={() => handleChange(name, option.label)}
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

export default Radios;
