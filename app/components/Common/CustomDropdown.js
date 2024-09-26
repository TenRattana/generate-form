import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useTheme } from "../../../contexts";
import { IconButton } from "react-native-paper";

const CustomDropdown = ({
  title,
  labels,
  values,
  data,
  selectedValue,
  onValueChange,
  optionStyle,
  lefticon,
}) => {
  const [options, setOptions] = useState([]);
  const [currentValue, setCurrentValue] = useState(selectedValue);
  const { colors, fonts, spacing } = useTheme();
  console.log("CustomDrop");

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setOptions(
        data.map((item) => ({
          label: item[labels] || "",
          value: item[values] || "",
          icon: item?.icon || "",
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
    item: {
      padding: 17,
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
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
            onValueChange(
              newValue.value,
              options.find((v) => v.value === currentValue)?.icon
            );
          }
        }}
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
        renderItem={(item) => (
          <View style={styles.item}>
            {item.icon && (
              <IconButton
                style={styles.icon}
                color={optionStyle ? colors.palette.dark : colors.dark}
                icon={item.icon || "check-all"}
                size={20}
              />
            )}
            <Text style={styles.selectedTextStyle}>{item.label}</Text>
          </View>
        )}
        renderRightIcon={() => (
          <View>
            {currentValue !== "" ? (
              <IconButton
                style={styles.icon}
                color={optionStyle ? colors.palette.dark : colors.dark}
                icon="window-close"
                size={20}
                onPress={() => {
                  setCurrentValue("");
                  onValueChange("");
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
      />
    </View>
  );
};

export default CustomDropdown;
