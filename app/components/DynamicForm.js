import React, { useState, useMemo } from "react";
import { View, StyleSheet, Text } from "react-native";
import { colors, spacing, fonts } from "../../theme";
import { useResponsive } from "./useResponsive";

import { Selects, Radios, Checkboxs, Textareas, Inputs } from "./index";

const DynamicForm = ({ fields, onChange }) => {
  const [formState, setFormState] = useState({});

  const responsive = useResponsive();

  console.log("Dynamic Form");

  const handleChange = (fieldName, value) => {
    setFormState((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));

    onChange(fieldName, value);
  };

  const renderField = (field) => {
    const option = field.MatchListDetail.map((item) => ({
      label: item.LDetailName,
    }));

    switch (field.TypeName) {
      case "Textinput":
        return (
          <Inputs
            placeholder={field.placeholder}
            hint={field.hint}
            label={field.ListName}
            name={field.mListId}
            formData={formState}
            handleChange={handleChange}
          />
        );
      case "Textaera":
        return (
          <Textareas
            placeholder={field.placeholder}
            hint={field.hint}
            label={field.ListName}
            name={field.mListId}
            formData={formState}
            handleChange={handleChange}
          />
        );
      case "Radio":
        return (
          <Radios
            name={field.mListId}
            option={option}
            formData={formState}
            handleChange={handleChange}
          />
        );
      case "Dropdown":
        return (
          <Selects
            name={field.mListId}
            option={option}
            hint={field.hint}
            formData={formState}
            handleChange={handleChange}
          />
        );
      case "Checkbox":
        return (
          <Checkboxs
            name={field.mListId}
            option={option}
            formData={formState}
            handleChange={handleChange}
          />
        );
      default:
        return null;
    }
  };

  const styles = StyleSheet.create({
    text: {
      fontSize:
        responsive === "small"
          ? fonts.xsm
          : responsive === "medium"
          ? fonts.sm
          : fonts.xsm,
      color: colors.palette.light,
    },
    containerInput: {
      marginVertical: spacing.md,
    },
    section: {
      padding: "2%",
      marginBottom: 20,
      borderRadius: 5,
      backgroundColor: "white",
    },
    sectionHead: {
      fontSize: 24,
      fontWeight: "bold",
      alignSelf: "center",
      marginVertical: 5,
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
    },
  });

  return (
    <View>
      {fields.map((field, index) => (
        <View key={index} style={styles.section}>
          <Text style={[styles.text, { color: colors.palette.dark }]}>
            {field.ListName}
          </Text>
          {renderField(field)}
        </View>
      ))}
    </View>
  );
};

export default DynamicForm;
