import React, { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { colors, spacing, fonts } from "../../theme";

export const CustomDropdown = ({
  fieldName,
  label,
  title,
  data,
  updatedropdown,
  reset, 
  selectedValue,
}) => {
  const [value, setValue] = useState( "");
  const [option, setOption] = useState([]);
  
  useEffect(() => {
    setOption(
      data.map((item) => ({
        label: item[label + "Name"],
        value: item[label + "ID"],
      }))
    );
  }, [data, label]);

  useEffect(() => {
    if (reset) {
      setValue("");
    }
  }, [reset]);

  useEffect(() => {
    setValue(selectedValue || "");
  }, [selectedValue]);

  const handleDropdownChange = (newValue) => {
    setValue(newValue);
    updatedropdown(fieldName, newValue.value);
  };

  const handleClear = () => {
    setValue("");
    updatedropdown(fieldName, "");
  };

  return (
    <View>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={option}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={`Select ${title}`}
        searchPlaceholder={`Search ${title}...`}
        value={value}
        onChange={handleDropdownChange}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={colors.dark}
            name="addusergroup"
            size={20}
          />
        )}
      />
      {value && (
        <TouchableOpacity style={styles.clearIcon} onPress={handleClear}>
          <AntDesign name="close" size={25} color={colors.dark} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    margin: spacing.sm,
    height: 50,
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
  },
  icon: {
    marginRight: spacing.xxs,
  },
  placeholderStyle: {
    fontSize: fonts.md,
  },
  selectedTextStyle: {
    fontSize: fonts.md,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: fonts.md,
  },
  clearIcon: {
    position: "absolute",
    right: spacing.xxl,
    top: spacing.lg,
  },
});
