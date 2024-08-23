import React, { useState, useReducer } from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";
import { colors, spacing, fonts } from "../../../theme";
import { Button, Divider } from "@rneui/themed";
import {
  Selects,
  Radios,
  Checkboxs,
  Textareas,
  Inputs,
  useResponsive,
  Dialogs,
} from "../../components";

const initialState = {
  fields: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_FIELD":
      return {
        ...state,
        fields: [...state.fields, { ...action.payload, formData: [] }],
      };

    case "UPDATE_FIELD":
      return {
        ...state,
        fields: state.fields.map((field) =>
          field.MQuestionID === action.payload.MQuestionID
            ? { ...field, ...action.payload }
            : field
        ),
      };

    case "ADD_FORM_DATA":
      return {
        ...state,
        fields: state.fields.map((field) =>
          field.CardName === action.payload.fieldName
            ? {
                ...field,
                formData: [...field.formData, action.payload.formData],
              }
            : field
        ),
      };

    default:
      return state;
  }
};

const CreateFormScreen = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogData, setDialogData] = useState(null);
  const [currentField, setCurrentField] = useState(null);
  const [target, setTarget] = useState(null);
  const [dataForm, setDataForm] = useState({});
  const responsive = useResponsive();

  const handleOpenDialog = (field, target) => {
    setCurrentField(field);
    setTarget(target);
    setDialogVisible(true);
  };

  const handleCloseDialog = () => {
    setDialogVisible(false);
    setTarget(null);
  };

  const handleDialogDone = (formData) => {
    if (currentField) {
      dispatch({
        type: "ADD_FORM_DATA",
        payload: { fieldName: currentField.CardName, formData },
      });
    }
    handleCloseDialog();
  };

  const handleDialogDoneType = (data) => {
    const existingField = state.fields.find(
      (field) => field.MQuestionID === data.MQuestionID
    );

    console.log(data);
    
    dispatch(
      existingField
        ? { type: "UPDATE_FIELD", payload: data }
        : { type: "ADD_FIELD", payload: data }
    );
    handleCloseDialog();
  };

  const handleChange = (name, value, type) => {
    setDataForm({
      ...dataForm,
      [name]: type === "CHECKBOX" ? value : value,
    });
  };

  const renderField = (field) => {
    switch (field.TypeName) {
      case "DROPDOWN":
        return (
          <Selects
            field={field}
            formData={dataForm}
            handleChange={handleChange}
          />
        );
      case "RADIO":
        return (
          <Radios
            field={field}
            formData={dataForm}
            handleChange={handleChange}
          />
        );
      case "CHECKBOX":
        return (
          <Checkboxs
            field={field}
            formData={dataForm}
            handleChange={handleChange}
          />
        );
      case "TEXTAREA":
        return (
          <Textareas
            field={field}
            formData={dataForm}
            handleChange={handleChange}
          />
        );
      case "FILE":
        return (
          <View style={styles.fileContainer}>
            <Text>File Upload</Text>
          </View>
        );
      case "TEXTINPUT":
        return (
          <Inputs
            field={field}
            formData={dataForm}
            handleChange={handleChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.textBuildHead}>Build Form</Text>
      <View style={styles.boxContainer}>
        <View style={styles.leftBox}>
          <Text style={styles.boxTitle}>Add Card and Form Data</Text>
          {state.fields.map((field, index) => (
            <View key={index} style={styles.section}>
              <Button
                buttonStyle={styles.button}
                onPress={() => handleOpenDialog(field, "Card")}
              >
                {field.CardName}
              </Button>
              <View>
                <Divider />
                {field.formData.map((form, formIndex) => (
                  <View key={formIndex}>
                    <Button
                      buttonStyle={styles.button}
                      onPress={() => handleOpenDialog(field, "FormData")}
                    >
                      {form.MQOptionID}
                    </Button>
                  </View>
                ))}
              </View>
              <Button
                buttonStyle={styles.button}
                onPress={() => handleOpenDialog(field, "AddField")}
              >
                Add Field
              </Button>
            </View>
          ))}
          <Button
            buttonStyle={styles.button}
            onPress={() => handleOpenDialog({}, "AddCard")}
          >
            Add Card
          </Button>
        </View>
        <View style={styles.rightBox}>
          <Text style={styles.boxTitle}>Display Data</Text>
          {state.fields.map((field, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.sectionTitle}>{field.CardName}</Text>
              <View
                style={[
                  styles.gridContainer,
                  { gridTemplateColumns: `repeat(${field.CardColumns}, 1fr)` },
                ]}
              >
                <Divider />
                {field.formData.map((form, formIndex) => (
                  <View
                    key={formIndex}
                    style={[
                      styles.gridItem,
                      {
                        flexBasis: `${
                          responsive === "small" ? 90 : 90 / field.CardColumns
                        }%`,
                      },
                    ]}
                  >
                    <Text>{form.MQOptionID}</Text>
                    {renderField(form)}
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </View>
      <Dialogs
        isVisible={dialogVisible}
        currentField={currentField}
        target={target}
        onClose={handleCloseDialog}
        data={dialogData}
        onDone={handleDialogDone}
        onDonestype={handleDialogDoneType}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: spacing.sm,
  },
  textBuildHead: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  boxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftBox: {
    flex: 3, // Adjust the size ratio here
    marginRight: spacing.sm,
  },
  rightBox: {
    flex: 7, // Adjust the size ratio here
  },
  section: {
    padding: "2%",
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: "white",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  gridItem: {
    margin: 5,
  },
  fileContainer: {
    padding: 10,
    backgroundColor: colors.palette.background,
  },
  button: {
    backgroundColor: colors.palette.primary,
    marginVertical: spacing.xxs,
  },
  boxTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default CreateFormScreen;
