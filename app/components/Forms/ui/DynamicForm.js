import React, { useState } from "react";
import { View, Text } from "react-native";
import { Selects, Radios, Checkboxs, Textareas, Inputs } from "../../";

export const DynamicForm = ({
  fields,
  checkListType,
  styles,
  colors,
  responsive,
  checkList,
  formData,
  handleChange,
  indexSubForm,
  matchCheckListOption,
}) => {
  const renderField = (field, index) => {
    const option = matchCheckListOption
      .find((option) => option.MCLOptionID === field.matchCheckListOption)
      ?.CheckListOptions.map((item) => ({
        label: item.CLOptionName,
      }));

    console.log(field);

    switch (field.CheckListTypeName) {
      case "Textinput":
        return (
          <Inputs
            placeholder={field.placeholder}
            hint={field.hint}
            label={field.CheckListName}
            name={field.matchCheckListId || `${indexSubForm}-${index}`}
            formData={formData}
            handleChange={(f, v) => handleChange(f, v)}
          />
        );
      case "Textaera":
        return (
          <Textareas
            placeholder={field.placeholder}
            hint={field.hint}
            label={field.ListName}
            name={field.matchCheckListId || `${indexSubForm}-${index}`}
            formData={formData}
            handleChange={(f, v) => handleChange(f, v)}
          />
        );
      case "Radio":
        return (
          <Radios
            name={field.matchCheckListId || `${indexSubForm}-${index}`}
            option={option}
            formData={formData}
            handleChange={(f, v) => handleChange(f, v)}
          />
        );
      case "Dropdown":
        return (
          <Selects
            name={field.matchCheckListId || `${indexSubForm}-${index}`}
            option={option}
            hint={field.hint}
            formData={formData}
            handleChange={(f, v) => handleChange(f, v)}
          />
        );
      case "Checkbox":
        return (
          <Checkboxs
            name={field.matchCheckListId || `${indexSubForm}-${index}`}
            option={option}
            formData={formData}
            handleChange={(f, v) => handleChange(f, v)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View>
      {fields.map((field, index) => (
        <View key={field.checkListId} style={styles.section}>
          <Text style={[styles.text, { color: colors.palette.dark }]}>
            {field.CheckListName}
          </Text>
          {renderField(field, index)}
        </View>
      ))}
    </View>
  );
};
