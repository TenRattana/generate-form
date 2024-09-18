import React from "react";
import { Text, View, Pressable } from "react-native";
import CustomDropdown from "../../Common/CustomDropdown";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Switch, Dialog } from "react-native-paper";

const validationSchema = Yup.object().shape({
  machineId: Yup.string().required("This machine field is required"),
  formId: Yup.string().required("This form field is required"),
});

const Dialog_mfm = ({
  style,
  isVisible,
  isEditing,
  initialValues,
  saveData,
  setIsVisible,
  dropmachine,
  dropform,
}) => {
  const { styles, colors, spacing, fonts, responsive } = style;
  console.log(initialValues);

  return (
    <Dialog isVisible={isVisible} onDismiss={() => setIsVisible(false)}>
      <Dialog.Title
        title={isEditing ? "Edit" : "Create"}
        titleStyle={{ alignSelf: "center" }}
      />
      <Dialog.Content>
        <Text
          style={[
            styles.textDark,
            { justifyContent: "center", marginBottom: 10, paddingLeft: 10 },
          ]}
        >
          {isEditing
            ? "Edit the details of the match machine and form."
            : "Enter the details for the new match machine and form."}
        </Text>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          validateOnChange={true}
          validateOnBlur={false}
          onSubmit={(values) => {
            console.log("Form values: ", values);
            saveData(values);
            setIsVisible(false);
          }}
        >
          {({
            setFieldValue,
            values,
            errors,
            touched,
            handleSubmit,
            isValid,
            dirty,
          }) => (
            <View>
              <Field
                name="machineId"
                component={({ field, form }) => (
                  <CustomDropdown
                    title="Machine"
                    labels="MachineName"
                    values="MachineID"
                    data={dropmachine}
                    selectedValue={values.machineId}
                    onValueChange={(value) => {
                      setFieldValue(field.name, value);
                      form.setTouched({ ...form.touched, [field.name]: true });
                    }}
                  />
                )}
              />

              {touched.machineId && errors.machineId && (
                <Text
                  style={[
                    styles.text,
                    styles.textError,
                    { marginLeft: spacing.xs, top: -spacing.xxs },
                  ]}
                >
                  {errors.machineId}
                </Text>
              )}

              <Field
                name="formId"
                component={({ field, form }) => (
                  <CustomDropdown
                    title="Group Check List Option"
                    labels="FormName"
                    values="FormID"
                    data={dropform}
                    selectedValue={values.formId}
                    onValueChange={(value) => {
                      setFieldValue(field.name, value);
                      form.setTouched({ ...form.touched, [field.name]: true });
                    }}
                  />
                )}
              />

              {touched.formId && errors.formId ? (
                <Text
                  style={{
                    color: "red",
                    marginVertical: 10,
                    left: 10,
                    top: -10,
                  }}
                >
                  {errors.formId}
                </Text>
              ) : null}

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 10,
                }}
              >
                <Text
                  style={[
                    styles.text,
                    styles.textDark,
                    { marginHorizontal: 12 },
                  ]}
                >
                  Status: {values.isActive ? "Active" : "Inactive"}
                </Text>

                <Switch
                  style={{ transform: [{ scale: 1.1 }], top: 2 }}
                  color={values.isActive ? colors.succeass : colors.disable}
                  value={values.isActive}
                  onValueChange={() =>
                    setFieldValue("isActive", !values.isActive)
                  }
                />
              </View>

              <View style={styles.containerFlexStyle}>
                <Pressable
                  onPress={handleSubmit}
                  style={[
                    styles.button,
                    isValid && dirty ? styles.backMain : styles.backDis,
                  ]}
                  disabled={!isValid || !dirty}
                >
                  <Text
                    style={[styles.textBold, styles.text, styles.textLight]}
                  >
                    Save
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setIsVisible(false)}
                  style={[styles.button, styles.backMain]}
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
  );
};

export default Dialog_mfm;
