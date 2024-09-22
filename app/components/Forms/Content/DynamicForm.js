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
  values,
  handleChange,
  handleBlur,
  touched,
  errors,
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
    console.log(field);

    switch (field.CheckListTypeName) {
      case "Textinput":
        return (
          <Inputs
            placeholder={field.placeholder}
            hint={field.hint}
            label={field.CheckListName}
            value={values.matchCheckListId || `${indexSubForm}-${index}`}
            handleChange={handleChange("matchCheckListId")}
            handleBlur={handleBlur("matchCheckListId")}
            error={touched.matchCheckListId && Boolean(errors.matchCheckListId)}
            errorMessage={
              touched.matchCheckListId ? errors.matchCheckListId : ""
            }
          />
        );
      case "Textaera":
        return (
          <Textareas
            placeholder={field.placeholder}
            hint={field.hint}
            label={field.CheckListName}
            value={values.matchCheckListId || `${indexSubForm}-${index}`}
            handleChange={handleChange("matchCheckListId")}
            handleBlur={handleBlur("matchCheckListId")}
            error={touched.matchCheckListId && Boolean(errors.matchCheckListId)}
            errorMessage={
              touched.matchCheckListId ? errors.matchCheckListId : ""
            }
          />
        );
      case "Radio":
        return (
          <Radios
            option={option}
            hint={field.hint}
            handleChange={(f, v) => handleChange(f, v)}
            value={values.matchCheckListId || `${indexSubForm}-${index}`}
            handleBlur={handleBlur("matchCheckListId")}
            error={touched.matchCheckListId && Boolean(errors.matchCheckListId)}
            errorMessage={
              touched.matchCheckListId ? errors.matchCheckListId : ""
            }
          />
        );
      case "Dropdown":
        return (
          <Selects
            option={option}
            hint={field.hint}
            handleChange={(f, v) => handleChange(f, v)}
            value={values.matchCheckListId || `${indexSubForm}-${index}`}
            handleBlur={handleBlur("matchCheckListId")}
            error={touched.matchCheckListId && Boolean(errors.matchCheckListId)}
            errorMessage={
              touched.matchCheckListId ? errors.matchCheckListId : ""
            }
          />
        );
      case "Checkbox":
        return (
          <Checkboxs
            option={option}
            hint={field.hint}
            handleChange={(f, v) => handleChange(f, v)}
            value={values.matchCheckListId || `${indexSubForm}-${index}`}
            handleBlur={handleBlur("matchCheckListId")}
            error={touched.matchCheckListId && Boolean(errors.matchCheckListId)}
            errorMessage={
              touched.matchCheckListId ? errors.matchCheckListId : ""
            }
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
