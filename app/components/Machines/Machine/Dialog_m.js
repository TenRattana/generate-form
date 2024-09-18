import React from "react";
import { Text, View, Pressable } from "react-native";
import CustomDropdown from "../../Common/CustomDropdown";
import Inputs from "../../Common/Inputs";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import { Switch, Dialog } from "react-native-paper";

const validationSchema = Yup.object().shape({
  machineGroupId: Yup.string().required("The machine group field is required."),
  machineName: Yup.string().required("The machine name field is required."),
  description: Yup.string().required("The description field is required."),
  displayOrder: Yup.number()
    .typeError("The display order field must be numeric.")
    .required("The display order field is required."),
  isActive: Yup.boolean("The active field is required."),
});

const Dialog_m = ({
  style,
  isVisible,
  isEditing,
  initialValues,
  saveData,
  setIsVisible,
  dropmachineGroup,
  machineGroup,
}) => {
  const { styles, colors, spacing } = style;

  return (
    <Dialog visible={isVisible} onDismiss={() => setIsVisible(false)}>
      <Dialog.Title title={isEditing ? "Edit" : "Create"} />
      <Dialog.Content>
        <Text style={[styles.textDark, { marginBottom: 10, paddingLeft: 10 }]}>
          {isEditing
            ? "Edit the details of the machine."
            : "Enter the details for the new machine."}
        </Text>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          validateOnBlur={false}
          validateOnChange={true}
          onSubmit={(values) => {
            saveData(values);
            setIsVisible(false);
          }}
        >
          {({
            handleChange,
            handleBlur,
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
                name="machineGroupId"
                component={({ field, form }) => (
                  <CustomDropdown
                    title="Machine Group"
                    labels="MGroupName"
                    values="MGroupID"
                    data={isEditing ? machineGroup : dropmachineGroup}
                    selectedValue={values.machineGroupId}
                    onValueChange={(value) => {
                      setFieldValue(field.name, value);
                      form.setTouched({ ...form.touched, [field.name]: true });
                    }}
                  />
                )}
              />

              {touched.machineGroupId && errors.machineGroupId && (
                <Text
                  style={[
                    styles.text,
                    styles.textError,
                    { marginLeft: spacing.xs, top: -spacing.xxs },
                  ]}
                >
                  {errors.machineGroupId}
                </Text>
              )}

              <Inputs
                placeholder="Enter Machine Name"
                label="Machine Name"
                handleChange={handleChange("machineName")}
                handleBlur={handleBlur("machineName")}
                value={values.machineName}
                error={touched.machineName && Boolean(errors.machineName)}
                errorMessage={touched.machineName ? errors.machineName : ""}
              />

              <Inputs
                placeholder="Enter Description"
                label="Description"
                handleChange={handleChange("description")}
                handleBlur={handleBlur("description")}
                value={values.description}
                error={touched.description && Boolean(errors.description)}
                errorMessage={touched.description ? errors.description : ""}
              />

              <Inputs
                placeholder="Enter Display Order"
                label="Display Order"
                handleChange={handleChange("displayOrder")}
                handleBlur={handleBlur("displayOrder")}
                value={values.displayOrder}
                error={touched.displayOrder && Boolean(errors.displayOrder)}
                errorMessage={touched.displayOrder ? errors.displayOrder : ""}
              />

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

export default Dialog_m;
