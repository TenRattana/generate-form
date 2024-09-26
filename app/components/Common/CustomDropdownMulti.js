import React, { useState, useEffect, useRef, useCallback } from "react";
import { StyleSheet, View, Text } from "react-native";
import { MultiSelect } from "react-native-element-dropdown";
import { useTheme } from "../../../contexts";
import { IconButton, Chip } from "react-native-paper";

const CustomDropdownMulti = ({
  labels,
  values,
  title,
  data,
  selectedValue,
  onValueChange,
  optionStyle,
  lefticon,
}) => {
  const [options, setOptions] = useState([]);
  const [currentValue, setCurrentValue] = useState(selectedValue || []);
  const { colors, spacing } = useTheme();
  const dialogRef = useRef(null);

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
    setCurrentValue(selectedValue || []);
  }, [selectedValue]);

  useEffect(() => {
    onValueChange(currentValue);
  }, [currentValue, onValueChange]);

  const handleChange = (selectedItems) => {
    setCurrentValue(selectedItems);
    console.log("Selected items:", selectedItems);
  };

  const styles = StyleSheet.create({
    dropdown: {
      marginHorizontal: spacing.xsm,
      marginVertical: spacing.xsm,
      height: 50,
      borderBottomColor: "gray",
      borderBottomWidth: 0.5,
    },
    placeholderStyle: {
      fontSize: 16,
    },
    selectedTextStyle: {
      fontSize: 14,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
    icon: {
      marginRight: 5,
    },
    item: {
      padding: 17,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
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
      <MultiSelect
        ref={dialogRef}
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
        onChange={handleChange}
        renderLeftIcon={() => (
          <IconButton
            style={styles.icon}
            color={optionStyle ? colors.palette.dark : colors.dark}
            icon={
              options.find((v) => v.value === currentValue)?.icon ||
              lefticon ||
              "check-all"
            }
            size={20}
          />
        )}
        renderRightIcon={() => (
          <View style={styles.clearIcon}>
            {currentValue.length > 0 ? (
              <IconButton
                style={styles.icon}
                color={optionStyle ? colors.palette.dark : colors.dark}
                icon="window-close"
                size={20}
                onPress={() => {
                  setCurrentValue([]);
                  onValueChange([]);
                }}
              />
            ) : (
              <IconButton
                style={styles.icon}
                color={optionStyle ? colors.palette.dark : colors.dark}
                icon="chevron-down"
                size={20}
              />
            )}
          </View>
        )}
        renderItem={(item) => (
          <View style={styles.item}>
            <Text style={styles.selectedTextStyle}>{item.label}</Text>
          </View>
        )}
        renderSelectedItem={(item, unSelect) => (
          <Chip icon="trash-can" onPress={() => unSelect && unSelect(item)}>
            {item.label}
          </Chip>
        )}
      />
    </View>
  );
};

export default CustomDropdownMulti;
