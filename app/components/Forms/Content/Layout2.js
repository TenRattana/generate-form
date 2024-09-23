import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { Divider } from "@rneui/themed";
import Selects from "../../Common/Selects";
import Radios from "../../Common/Radios";
import Checkboxs from "../../Common/Checkboxs";
import Textareas from "../../Common/Textareas";
import Inputs from "../../Common/Inputs";

const Layout2 = ({ style, form, state, groupCheckListOption }) => {
  const { styles, colors, spacing, responsive } = style;

  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    const initialValues = {};
    state.subForms.forEach((subForm) => {
      subForm.fields.forEach((field) => {
        initialValues[field.matchCheckListId] = "";
      });
    });
    setFormValues(initialValues);
  }, [state.subForms]);

  const handleChange = (fieldName, value) => {
    console.log(fieldName , value);
    
    setFormValues((prev) => ({
      ...prev,
      [fieldName]: value, 
      expectedResult: {
        ...prev.expectedResult,
        [fieldName]: value, 
      },
    }));
  };

  console.log(formValues);
  
  const renderField = (field) => {
    const fieldName = field.matchCheckListId;

    switch (field.CheckListTypeName) {
      case "Textinput":
        return (
          <Inputs
            placeholder={field.placeholder}
            hint={field.hint}
            label={field.CheckListName}
            value={formValues[fieldName] || ""}
            handleChange={(value) => handleChange(fieldName, value)}
          />
        );
      case "Textarea":
        return (
          <Textareas
            placeholder={field.placeholder}
            hint={field.hint}
            label={field.CheckListName}
            value={formValues[fieldName] || ""}
            handleChange={(value) => handleChange(fieldName, value)}
          />
        );
      case "Dropdown":
        const options = groupCheckListOption
          ?.find((opt) => opt.GCLOptionID === field.groupCheckListOptionId)
          ?.CheckListOptions.map((item) => ({
            label: item.CLOptionName,
            value: item.CLOptionID,
          }));
        return (
          <Selects
            option={options}
            hint={field.hint}
            label={field.CheckListName}
            value={formValues[fieldName] || ""}
            handleChange={(value) => handleChange(fieldName, value)}
          />
        );
      case "Radio":
        const radioOptions = groupCheckListOption
          ?.find((opt) => opt.GCLOptionID === field.groupCheckListOptionId)
          ?.CheckListOptions.map((item) => ({
            label: item.CLOptionName,
            value: item.CLOptionID,
          }));
        return (
          <Radios
            option={radioOptions}
            hint={field.hint}
            label={field.CheckListName}
            value={formValues[fieldName] || ""}
            handleChange={(value) => handleChange(fieldName, value)}
          />
        );
      case "Checkbox":
        const checkboxOptions = groupCheckListOption
          ?.find((opt) => opt.GCLOptionID === field.groupCheckListOptionId)
          ?.CheckListOptions.map((item) => ({
            label: item.CLOptionName,
            value: item.CLOptionID,
          }));
        return (
          <Checkboxs
            option={checkboxOptions}
            hint={field.hint}
            label={field.CheckListName}
            value={formValues[fieldName] || ""}
            handleChange={(value) => handleChange(fieldName, value)}
          />
        );
      default:
        return null;
    }
  };

  const renderFields = (subForm) => {
    return subForm.fields.map((field, fieldIndex) => {
      const containerStyle = {
        flexBasis:
          responsive === "small" || responsive === "medium"
            ? "100%"
            : `${100 / subForm.columns}%`,
        padding: 5,
      };

      return (
        <View
          key={`field-${fieldIndex}-${subForm.subFormName}`}
          style={containerStyle}
        >
          <Text
            style={[styles.text, styles.textDark, { paddingLeft: spacing.sm }]}
          >
            {field.CheckListName}
          </Text>
          {renderField(field)}
        </View>
      );
    });
  };

  const onFormSubmit = () => {
    console.log("Form values:", formValues);
  };

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
      <Text style={[styles.textHeader, { color: colors.palette.dark }]}>
        {form.formName || "Content Name"}
      </Text>
      <Divider
        style={{ left: -50 }}
        subHeader={form.description || "Content Description"}
        inset={true}
        subHeaderStyle={{
          marginTop: 2,
          left: -50,
          color: colors.palette.dark,
        }}
      />

      <View>
        {state.subForms.map((subForm, index) => (
          <View style={styles.card} key={`subForm-${index}`}>
            <Text style={styles.cardTitle}>{subForm.subFormName}</Text>
            <View style={styles.formContainer}>
              {renderFields(subForm)}
            </View>
          </View>
        ))}
        {state.subForms[0]?.fields.length > 0 && (
          <View style={styles.buttonContainer}>
            <Pressable
              onPress={onFormSubmit}
              style={[styles.button , styles.backMain]}
            >
              <Text style={[styles.textBold, styles.text, styles.textLight]}>
                Submit
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Layout2;

const styles = StyleSheet.create({
  // Add your styles here
});
