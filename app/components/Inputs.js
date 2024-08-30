import React from "react";
import { TextInput, View, StyleSheet, Text } from "react-native";
import { colors, spacing, fonts } from "../../theme";

const Inputs = ({ field, formData, handleChange }) => {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder={field.placeholder}
        name={field.ListName}
        onChangeText={(value) => handleChange(field.mListId, value)}
        value={formData[field.mListId] || ""}
        style={styles.textInput}
      />
      {field.hint ? <Text style={styles.label}>{field.hint}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  textInput: {
    borderColor: colors.border,
    borderWidth: 1,
    padding: spacing.xs,
    fontSize: fonts.xsm,
    borderRadius: 5,
    backgroundColor: colors.background,
  },
  label: {
    fontSize: fonts.xsm,
    marginLeft: spacing.xxs,
    marginTop: spacing.xs,
    color: colors.palette.gray90,
  },
});

export default Inputs;
