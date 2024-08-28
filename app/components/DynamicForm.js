import React, { useState, useMemo } from "react";
import { View, StyleSheet, Text } from "react-native";
import { colors, spacing, fonts } from "../../theme";
import { useResponsive } from "./useResponsive";

import { Selects, Radios, Checkboxs, Textareas, Inputs } from "./index";

const DynamicForm = ({ fields }) => {
  const [formState, setFormState] = useState({});

  const responsive = useResponsive();

  const handleChange = (fieldName, value) => {
    setFormState((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const renderField = (field) => {
    switch (field.TypeName) {
      case "TEXTINPUT":
        return (
          <Inputs
            field={field}
            formData={formState}
            handleChange={handleChange}
          />
        );
      case "TEXTAERA":
        return (
          <Textareas
            field={field}
            formData={formState}
            handleChange={handleChange}
          />
        );
      case "RADIO":
        return (
          <Radios
            field={field}
            formData={formState}
            handleChange={handleChange}
          />
        );
      case "DROPDOWN":
        return (
          <Selects
            field={field}
            formData={formState}
            handleChange={handleChange}
          />
        );
      case "CHECKBOX":
        return (
          <Checkboxs
            field={field}
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
    containerButton: {
      alignSelf: "center",
      width: "90%",
      marginVertical: "1%",
      marginHorizontal: "2%",
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
