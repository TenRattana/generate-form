import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { useTheme } from "../../../contexts";

const CustomDropdown = ({
  title,
  labels,
  values,
  data,
  selectedValue,
  onValueChange,
  optionStyle,
}) => {
  const [options, setOptions] = useState([]);
  const [currentValue, setCurrentValue] = useState(selectedValue);
  const { colors, fonts, spacing } = useTheme();

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setOptions(
        data.map((item) => ({
          label: item[labels] || "",
          value: item[values] || "",
        }))
      );
    }
  }, [data, labels, values]);

  useEffect(() => {
    setCurrentValue(selectedValue);
  }, [selectedValue]);

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
      top: 10,
      justifyContent: "center",
      alignItems: "center",
      marginRight: spacing.xxs,
    },
  });

  return (
    <View>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={[styles.placeholderStyle, optionStyle]}
        selectedTextStyle={[styles.selectedTextStyle, optionStyle]}
        inputSearchStyle={[styles.inputSearchStyle, optionStyle]}
        iconStyle={[styles.iconStyle, optionStyle]}
        data={options}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={`Select ${title}`}
        searchPlaceholder={`Search ${title}...`}
        value={currentValue}
        onChange={(newValue) => {
          if (newValue) {
            setCurrentValue(newValue.value);
            onValueChange(newValue.value);
          }
        }}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={optionStyle ? colors.palette.dark : colors.dark}
            name="addusergroup"
            size={20}
          />
        )}
        renderRightIcon={() => (
          <View style={styles.clearIcon}>
            {currentValue !== "" ? (
              <AntDesign
                name="close"
                size={20}
                color={optionStyle ? colors.palette.dark : colors.dark}
                onPress={() => {
                  setCurrentValue("");
                  onValueChange("");
                }}
              />
            ) : (
              <Entypo
                name="chevron-down"
                size={20}
                color={optionStyle ? colors.palette.dark : colors.dark}
              />
            )}
          </View>
        )}
      />
    </View>
  );
};

export default CustomDropdown;
