import React from "react";
import { CheckBox } from "@rneui/themed";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, fonts } from "../../theme";

const Radios = ({ field, formData, handleChange }) => {
  if (!field.MatchListDetail || field.MatchListDetail.length === 0) {
    return "";
  }

  return field.MatchListDetail.map((option, LDetailID) => (
    <View key={LDetailID} style={styles.container}>
      <CheckBox
        checked={formData[field.MLDetailID] === option.LDetailName}
        onPress={() => handleChange(field.MLDetailID, option.LDetailName)}
        containerStyle={styles.checkboxContainer}
        textStyle={styles.checkboxText}
      />
      <Text style={styles.label}>{option.LDetailName}</Text>
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
