import React from "react";
import { Picker } from "@react-native-picker/picker";
import { View, StyleSheet, Text } from "react-native";
import { colors, spacing, fonts } from "../../theme";

const Selects = ({ field, formData, handleChange }) => {
  if (!field.MatchListDetail || field.MatchListDetail.length === 0) {
    return "";
  }

  return (
    <View style={styles.container}>
      <View style={styles.dropdown}>
        <Picker
          selectedValue={formData[field.mListId]}
          onValueChange={(value) => handleChange(field.mListId, value)}
          style={styles.picker}
        >
          <Picker.Item label="Select..." value="" />
          {field.MatchListDetail.map((option, LDetailID) => (
            <Picker.Item
              key={LDetailID}
              label={option.LDetailName}
              value={option.LDetailName}
            />
          ))}
        </Picker>
      </View>
      {field.hint ? <Text style={styles.label}>{field.hint}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  dropdown: {
    marginVertical: spacing.sm,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: colors.background,
  },
  picker: {
    height: 40,
    width: "100%",
  },
  label: {
    fontSize: fonts.xsm,
    marginLeft: spacing.xxs,
    color: colors.palette.gray90,
  },
});

export default Selects;
