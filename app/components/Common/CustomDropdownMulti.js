import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { useTheme } from "../../../contexts";
import DropDownPicker from "react-native-dropdown-picker";
import { Chip } from "react-native-paper";

const CustomDropdownMulti = ({
  labels,
  values,
  title,
  data,
  selectedValue,
  onValueChange,
}) => {
  const [options, setOptions] = useState([]);
  const [currentValue, setCurrentValue] = useState(selectedValue || []);
  const [isOpen, setIsOpen] = useState(false);
  const { colors, spacing } = useTheme();

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

  const handleValueChange = (value) => {
    const newValue = currentValue.includes(value)
      ? currentValue.filter((item) => item !== value)
      : [...currentValue, value];

    setCurrentValue(newValue);
    onValueChange(newValue);
  };
  const styles = StyleSheet.create({
    container: {
      marginVertical: 10,
      paddingHorizontal: 16,
      zIndex: 1,
    },
    dropdown: {
      height: 50,
      borderColor: "gray",
      borderWidth: 1,
      borderRadius: 8,
      backgroundColor: "#fff",
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
      marginTop: 10,
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    clearIcon: {
      justifyContent: "center",
      alignItems: "center",
      marginRight: spacing.xxs,
    },
    chip: {
      marginRight: 5,
      marginBottom: 5,
    },
  });

  return (
    <View style={styles.container}>
      <DropDownPicker
        multiple
        open={isOpen}
        items={options}
        value={currentValue}
        setItems={setOptions}
        setOpen={setIsOpen}
        setValue={setCurrentValue}
        onChangeItem={(item) => handleValueChange(item.value)}
        placeholder={`Select ${title}`}
        style={styles.dropdown}
        modalTitle="Select an item"
        maxHeight={300}
        searchable
        searchPlaceholder="Search..."
        searchContainerStyle={{
          borderColor: "#DDDDDD",
          borderWidth: 0.5,
          height: 45,
          margin: 6,
          marginBottom: 8,
          paddingHorizontal: 8,
        }}
        searchTextInputStyle={{
          fontSize: 16,
          textAlign: "left",
          height: 40,
        }}
        customItemContainerStyle={{
          backgroundColor: "#dfdfdf",
        }}
      />
      {currentValue.length > 0 ? (
        <View style={styles.item}>
          {currentValue.map((item) => (
            <Chip
              key={item}
              style={styles.chip}
              icon="close"
              onPress={() => handleValueChange(item)}
            >
              {options.find((option) => option.value === item)?.label || item}
            </Chip>
          ))}
        </View>
      ) : (
        false
      )}
    </View>
  );
};

export default CustomDropdownMulti;
