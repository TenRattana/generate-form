import React, { useState , useMemo} from "react";
import { StyleSheet, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { colors, spacing, fonts } from "../../theme";
import { useResponsive } from "./useResponsive";
import Entypo from "@expo/vector-icons/Entypo";

export const CustomDropdown = ({
  fieldName,
  labels,
  values,
  title,
  data,
  updatedropdown,
  reset,
  selectedValue,
  optionStyle,
}) => {
  const [value, setValue] = useState("");
  const [option, setOption] = useState([]);
  const responsive = useResponsive();

  useMemo(() => {
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

  useMemo(() => {
    if (reset) {
      setValue("");
    }
  }, [reset]);

  useMemo(() => {
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
        placeholderStyle={[styles.placeholderStyle, optionStyle]}
        selectedTextStyle={[styles.selectedTextStyle, optionStyle]}
        inputSearchStyle={[styles.inputSearchStyle, optionStyle]}
        iconStyle={[styles.iconStyle, optionStyle]}
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
            color={optionStyle ? colors.palette.light : colors.dark}
            name="addusergroup"
            size={20}
          />
        )}
        renderRightIcon={() => (
          <View style={styles.clearIcon}>
            {value !== "" ? (
              <AntDesign
                name="close"
                size={20}
                color={optionStyle ? colors.palette.light : colors.dark}
                onPress={handleClear}
              />
            ) : (
              <Entypo
                name="chevron-down"
                size={20}
                color={optionStyle ? colors.palette.light : colors.dark}
              />
            )}
          </View>
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
