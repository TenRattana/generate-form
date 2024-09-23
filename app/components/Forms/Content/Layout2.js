import { StyleSheet, Text, View, ScrollView } from "react-native";
import React from "react";
import { Divider, Button } from "@rneui/themed";
import Selects from "../../Common/Selects";
import Radios from "../../Common/Radios";
import Checkboxs from "../../Common/Checkboxs";
import Textareas from "../../Common/Textareas";
import Inputs from "../../Common/Inputs";
import { Card } from "@rneui/themed";
import { Formik } from "formik";

const Layout2 = ({
  style,
  form,
  state,
  checkListType,
  checkList,
  groupCheckListOption,
}) => {
  const { styles, colors, spacing, fonts, responsive } = style;

  const renderField = (
    field,
    values,
    handleChange,
    handleBlur,
    touched,
    errors
  ) => {
    const option = groupCheckListOption
      .find((opt) => opt.GCLOptionID === field.groupCheckListOptionId)
      ?.CheckListOptions.map((item) => ({
        label: item.CLOptionName,
        value: item.CLOptionID,
      }));

    const fieldName = `fields[${field.matchCheckListId}]`;

    switch (field.CheckListTypeName) {
      case "Textinput":
        return (
          <Inputs
            key={fieldName}
            placeholder={field.placeholder}
            hint={field.hint}
            label={field.CheckListName}
            value={values[fieldName] || ""}
            handleChange={handleChange(fieldName)}
            handleBlur={handleBlur(fieldName)}
            error={touched[fieldName] && Boolean(errors[fieldName])}
            errorMessage={touched[fieldName] ? errors[fieldName] : ""}
          />
        );
      case "Textarea":
        return (
          <Textareas
            key={fieldName}
            placeholder={field.placeholder}
            hint={field.hint}
            label={field.CheckListName}
            value={values[fieldName] || ""}
            handleChange={handleChange(fieldName)}
            handleBlur={handleBlur(fieldName)}
            error={touched[fieldName] && Boolean(errors[fieldName])}
            errorMessage={touched[fieldName] ? errors[fieldName] : ""}
          />
        );
      case "Radio":
        return (
          <Radios
            key={fieldName}
            option={option}
            hint={field.hint}
            handleChange={(value) => handleChange(fieldName)(value)}
            value={values[fieldName] || ""}
            handleBlur={handleBlur(fieldName)}
            error={touched[fieldName] && Boolean(errors[fieldName])}
            errorMessage={touched[fieldName] ? errors[fieldName] : ""}
          />
        );
      case "Dropdown":
        return (
          <Selects
            key={fieldName}
            option={option}
            hint={field.hint}
            handleChange={handleChange(fieldName)}
            value={values[fieldName] || ""}
            handleBlur={handleBlur(fieldName)}
            error={touched[fieldName] && Boolean(errors[fieldName])}
            errorMessage={touched[fieldName] ? errors[fieldName] : ""}
          />
        );
      case "Checkbox":
        return (
          <Checkboxs
            key={fieldName}
            option={option}
            hint={field.hint}
            handleChange={handleChange(fieldName)}
            value={values[fieldName] || []}
            handleBlur={handleBlur(fieldName)}
            error={touched[fieldName] && Boolean(errors[fieldName])}
            errorMessage={touched[fieldName] ? errors[fieldName] : ""}
          />
        );
      default:
        return null;
    }
  };

  const getInitialValues = () => {
    const initialValues = { fields: {} };
    state.subForms.forEach((subForm) => {
      subForm.fields.forEach((field) => {
        initialValues.fields[field.matchCheckListId] = field.defaultValue || "";
      });
    });
    return initialValues;
  };

  const onFormSubmit = (values) => {
    console.log("Form values:", values);
  };

  const renderFields = (
    subForm,
    values,
    handleChange,
    handleBlur,
    touched,
    errors
  ) => {
    return subForm.fields.map((field, fieldIndex) => {
      const containerStyle = {
        flexBasis:
          responsive === "small" || responsive === "medium"
            ? "100%"
            : `${100 / subForm.columns}%`,
        flexGrow: Number(field.displayOrder) || 1,
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
          {renderField(
            field,
            values,
            handleChange,
            handleBlur,
            touched,
            errors
          )}
        </View>
      );
    });
  };

  console.log(getInitialValues());

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

      <Formik initialValues={getInitialValues()} onSubmit={onFormSubmit}>
        {({
          handleChange,
          handleBlur,
          values,
          errors,
          touched,
          submitForm,
        }) => (
          <View>
            {state.subForms.map((subForm, index) => (
              <View style={styles.card} key={`subForm-${index}`}>
                <Text style={styles.cardTitle}>{subForm.subFormName}</Text>
                <View style={styles.formContainer}>
                  {renderFields(
                    subForm,
                    values,
                    handleChange,
                    handleBlur,
                    touched,
                    errors
                  )}
                </View>
              </View>
            ))}
            {state.subForms[0]?.fields.length > 0 ? (
              <View style={styles.buttonContainer}>
                <Button
                  title="Submit"
                  titleStyle={styles.text}
                  containerStyle={styles.containerButton}
                  onPress={submitForm}
                />
              </View>
            ) : (
              false
            )}
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

export default Layout2;
