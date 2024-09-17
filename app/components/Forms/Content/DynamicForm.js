import React, { useState } from "react";
import { View, Text } from "react-native";
import Selects from "../../Common/Selects";
import Radios from "../../Common/Radios";
import Checkboxs from "../../Common/Checkboxs";
import Textareas from "../../Common/Textareas";
import Inputs from "../../Common/Inputs";

const DynamicForm = ({
  fields,
  checkListType,
  style,
  checkList,
  formData,
  handleChange,
  indexSubForm,
  groupCheckListOption,
}) => {
  const { styles, colors, spacing, fonts, responsive } = style;
  console.log("DynamicForm");

  const renderField = (field, index) => {
    const option = groupCheckListOption
      .find((option) => option.GCLOptionID === field.groupCheckListOptionId)
      ?.CheckListOptions.map((item) => ({
        label: item.CLOptionName,
      }));

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

export default DynamicForm;
