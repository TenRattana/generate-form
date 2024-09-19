import React, { useState, useEffect } from "react";
import { StyleSheet, View, Pressable, Text } from "react-native";
import { MultiSelect } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { useTheme } from "../../../contexts";

const CustomDropdownMulti = ({
  labels,
  values,
  title,
  data,
  selectedValue,
  onValueChange,
  optionStyle,
}) => {
  const [options, setOptions] = useState([]);
  const [currentValue, setCurrentValue] = useState(selectedValue || []);
  const { colors, fonts, spacing } = useTheme();
  console.log("CustomDropMul");

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

  const styles = StyleSheet.create({
    dropdown: {
      marginHorizontal: spacing.xsm,
      marginVertical: spacing.xsm,
      marginTop: 0,
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
    selectedStyle: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 14,
      backgroundColor: "white",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      marginLeft: 12,
      marginVertical: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      elevation: 2,
    },
    textSelectedStyle: {
      marginRight: 5,
      fontSize: 16,
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
        onChange={(selectedItems) => {
          setCurrentValue(selectedItems);
          onValueChange(selectedItems);
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
            {currentValue.length > 0 ? (
              <AntDesign
                name="close"
                size={20}
                color={optionStyle ? colors.palette.dark : colors.dark}
                onPress={() => {
                  setCurrentValue([]);
                  onValueChange([]);
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
        renderItem={(item) => (
          <View style={styles.item}>
            <Text style={styles.selectedTextStyle}>{item.label}</Text>
            <AntDesign
              style={styles.icon}
              color="black"
              name="Safety"
              size={20}
            />
          </View>
        )}
        renderSelectedItem={(item, unSelect) => (
          <Pressable onPress={() => unSelect && unSelect(item)}>
            <View style={styles.selectedStyle}>
              <Text style={styles.textSelectedStyle}>{item.label}</Text>
              <AntDesign color="black" name="delete" size={17} />
            </View>
          </Pressable>
        )}
      />
    </View>
  );
};

export default CustomDropdownMulti;
