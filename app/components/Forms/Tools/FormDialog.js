import React from "react";
import { View, Pressable } from "react-native";
import { Portal, Dialog, Text } from "react-native-paper";
import Inputs from "../../Common/Inputs";
import { Formik } from "formik";
import * as Yup from "yup";

const validationSchemaForm = Yup.object().shape({
  formName: Yup.string().required("The form name field is required."),
  description: Yup.string().required("The description field is required."),
});

const FormDialog = ({
  form,
  isVisible,
  styles,
  setShowDialogs,
  setForm,
  responsive,
}) => {
  return (
    <Portal>
      <Dialog
        visible={isVisible}
        onDismiss={() => setShowDialogs({ form: false })}
        style={styles.containerDialog}
        contentStyle={styles.containerDialog}
      >
        <Dialog.Title style={{ paddingLeft: 8 }}>
          Create/Edit Subform Detail
        </Dialog.Title>
        <Dialog.Content>
          <Text
            style={[styles.textDark, { marginBottom: 10, paddingLeft: 10 }]}
          >
            Enter the details for the form.
          </Text>
          <Formik
            initialValues={form}
            validationSchema={validationSchemaForm}
            validateOnBlur={false}
            validateOnChange={true}
            onSubmit={(values) => {
              setForm(values);
              setShowDialogs();
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              dirty,
              isValid,
            }) => (
              <View style={{ padding: 0 }}>
                <Inputs
                  placeholder="Enter Content Name"
                  label="Content Name"
                  handleChange={handleChange("formName")}
                  handleBlur={handleBlur("formName")}
                  value={values.formName}
                  error={touched.formName && Boolean(errors.formName)}
                  errorMessage={touched.formName ? errors.formName : ""}
                />
                <Inputs
                  label="Content Description"
                  placeholder="Enter Content Description"
                  handleChange={handleChange("description")}
                  handleBlur={handleBlur("description")}
                  value={values.description}
                  error={touched.description && Boolean(errors.description)}
                  errorMessage={touched.description ? errors.description : ""}
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
                    <Text style={[styles.text, styles.textLight]}>
                      Save Form
                    </Text>
                  </Pressable>

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

export default FormDialog;
