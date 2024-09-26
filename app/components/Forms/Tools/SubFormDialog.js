import React from "react";
import { View, Pressable } from "react-native";
import { Portal, Dialog, Text } from "react-native-paper";
import Inputs from "../../Common/Inputs";
import { Formik } from "formik";
import * as Yup from "yup";

const validationSchemaSubForm = Yup.object().shape({
  subFormName: Yup.string().required(
    "The machine group name field is required."
  ),
  columns: Yup.number().required("The columns field is required."),
});

const SubFormDialog = ({
  isVisible,
  setShowDialogs,
  styles,
  editMode,
  subForm,
  saveSubForm,
  responsive,
  onDelete,
}) => {
  return (
    <Portal>
      <Dialog
        visible={isVisible}
        onDismiss={() => setShowDialogs()}
        style={styles.containerDialog}
        contentStyle={styles.containerDialog}
      >
        <Dialog.Title style={{ paddingLeft: 8 }}>
          {editMode ? "Edit Subform Detail" : "Create Subform Detail"}
        </Dialog.Title>
        <Dialog.Content>
          <Text
            style={[styles.textDark, { marginBottom: 10, paddingLeft: 10 }]}
          >
            {editMode
              ? "Edit the details of the sub form."
              : "Enter the details for the new sub form."}
          </Text>
          <Formik
            initialValues={subForm}
            validationSchema={validationSchemaSubForm}
            validateOnBlur={false}
            validateOnChange={true}
            onSubmit={(values) => {
              saveSubForm(values, editMode ? "update" : "add");
            }}
          >
            {({
              handleChange,
              handleBlur,
              values,
              errors,
              touched,
              handleSubmit,
              isValid,
              dirty,
            }) => (
              <View>
                <Inputs
                  placeholder="Enter Sub Form Name"
                  label="Sub Form Name"
                  handleChange={handleChange("subFormName")}
                  handleBlur={handleBlur("subFormName")}
                  value={values.subFormName}
                  error={touched.subFormName && Boolean(errors.subFormName)}
                  errorMessage={touched.subFormName ? errors.subFormName : ""}
                />

                <Inputs
                  placeholder="Enter Columns"
                  label="Columns"
                  handleChange={handleChange("columns")}
                  handleBlur={handleBlur("columns")}
                  value={String(values.columns)}
                  error={touched.columns && Boolean(errors.columns)}
                  errorMessage={touched.columns ? errors.columns : ""}
                />

                <View
                  style={[
                    styles.containerButton,
                    {
                      flexDirection: responsive === "small" ? "column" : "row",
                      justifyContent: "center",
                    },
                  ]}
                >
                  <Pressable
                    onPress={handleSubmit}
                    style={[
                      styles.button,
                      styles.bwidth,
                      isValid && dirty ? styles.backMain : styles.backDis,
                    ]}
                    disabled={!isValid || !dirty}
                  >
                    <Text
                      style={[styles.textBold, styles.text, styles.textLight]}
                    >
                      {editMode ? "Update SubForm" : "Add SubForm"}
                    </Text>
                  </Pressable>

                  {editMode ? (
                    <Pressable
                      onPress={() => onDelete(values.subFormId)}
                      style={[styles.button, styles.bwidth, styles.backMain]}
                    >
                      <Text
                        style={[styles.textBold, styles.text, styles.textLight]}
                      >
                        Delete sub form
                      </Text>
                    </Pressable>
                  ) : (
                    false
                  )}

                  <Pressable
                    onPress={() => setShowDialogs()}
                    style={[styles.button, styles.backMain, styles.bwidth]}
                  >
                    <Text
                      style={[styles.textBold, styles.text, styles.textLight]}
                    >
                      Cancel
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}
          </Formik>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

export default SubFormDialog;
