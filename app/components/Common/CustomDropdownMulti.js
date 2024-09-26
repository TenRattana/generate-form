import React, { useState, useEffect } from "react";
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
  const [isOpen, setIsOpen] = useState(false); // เก็บค่าชั่วคราว
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
    setTempValue(selectedValue || []);
  }, [selectedValue]);

  const handleConfirm = () => {
    onValueChange(currentValue);
    setIsOpen(false);
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
      justifyContent: "center",
      alignItems: "center",
      marginRight: spacing.xxs,
    },
  });

  return (
    <View>
      <MultiSelect
        isOpen={isOpen}
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
        value={tempValue} 
        onChange={handleSelectItem} 
        onClose={handleDropdownClose} 
        renderLeftIcon={() => (
          <IconButton
            style={styles.icon}
            color={optionStyle ? colors.palette.dark : colors.dark}
            icon={lefticon || "check-all"}
            size={20}
          />
        )}
        renderRightIcon={() => (
          <View style={styles.clearIcon}>
            {tempValue.length > 0 ? (
              <IconButton
                style={styles.icon}
                color={optionStyle ? colors.palette.dark : colors.dark}
                icon="window-close"
                size={20}
                onPress={() => {
                  setTempValue([]); // เคลียร์ค่าชั่วคราว
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
      />

      {/* แสดงผลการเลือกในรูปแบบ Chips */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          marginVertical: spacing.xsm,
        }}
      >
        {currentValue.map((selectedItem) => {
          const selectedLabel = options.find(
            (opt) => opt.value === selectedItem
          )?.label;
          return (
            <Chip
              key={selectedItem}
              icon="close"
              onPress={() => {
                const updatedValue = currentValue.filter(
                  (value) => value !== selectedItem
                );
                setTempValue(updatedValue); // ลบค่าชั่วคราว
                setCurrentValue(updatedValue); // อัปเดต currentValue
                onValueChange(updatedValue); // ส่งค่ากลับ
              }}
              style={{ marginRight: 5, marginBottom: 5 }}
            >
              {selectedLabel}
            </Chip>
          );
        })}
      </View>
    </View>
  );
};

export default CustomDropdownMulti;
