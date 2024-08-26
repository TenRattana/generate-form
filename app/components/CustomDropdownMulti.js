import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { MultiSelect } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { colors, spacing, fonts } from "../../theme";
import Entypo from "@expo/vector-icons/Entypo";

export const CustomDropdownMulti = ({
  fieldName,
  labels,
  values,
  title,
  data,
  updatedropdown,
  reset,
  selectedValue,
}) => {
  const [selected, setSelected] = useState([]);
  const [option, setOption] = useState([]);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setOption(
        data.map((item) => ({
          label: item[labels] || "",
          value: item[values] || "",
        }))
      );
    } else {
      setOption([]);
    }
  }, [data, labels, values]);

  useEffect(() => {
    if (reset) {
      setSelected([]);
    }
  }, [reset]);

  useEffect(() => {
    setSelected(selectedValue || []);
  }, [selectedValue]);

  const handleDropdownChange = (newValue) => {
    setSelected(newValue);
    updatedropdown(fieldName, newValue.value);
  };

  const handleClear = () => {
    setSelected([]);
    updatedropdown(fieldName, []);
  };

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
        <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <MultiSelect
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={option}
        labelField="label"
        valueField="value"
        placeholder={`Select ${title}`}
        value={selected}
        search
        searchPlaceholder={`Search ${title}...`}
        onChange={handleDropdownChange}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color="black"
            name="addusergroup"
            size={20}
          />
        )}
        renderRightIcon={() => (
          <View style={styles.clearIcon}>
            {selected.length < 0 ? (
              <AntDesign
                name="close"
                size={20}
                color={colors.dark}
                onPress={handleClear}
              />
            ) : (
              <Entypo name="chevron-down" size={20} color={colors.dark} />
            )}
          </View>
        )}
        renderItem={renderItem}
        renderSelectedItem={(item, unSelect) => (
          <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
            <View style={styles.selectedStyle}>
              <Text style={styles.textSelectedStyle}>{item.label}</Text>
              <AntDesign color="black" name="delete" size={17} />
            </View>
          </TouchableOpacity>
        )}
      />
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
    marginLeft: 12,
    marginVertical: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
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
