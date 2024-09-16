import React from "react";
import { Text, View, Pressable } from "react-native";
import { CustomDropdown } from "../../CustomDropdown";
import { Dialog, Input } from "@rneui/themed";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import AntDesign from "@expo/vector-icons/AntDesign";

const validationSchema = Yup.object().shape({
  // machineGroupId: Yup.string().when("$isEditing", {
  //   is: true,
  //   then: Yup.string().required("The machine group field is required."),
  //   otherwise: Yup.string(),
  // }),
  machineName: Yup.string().required("The machine name field is required."),
  description: Yup.string().required("The description field is required."),
  displayOrder: Yup.number()
    .typeError("The display order field must be numeric.")
    .required("The display order field is required."),
});

const Dialog_m = ({
  style,
  isVisible,
  isEditing,
  initialValues,
  saveData,
  setIsVisible,
  dropmachineGroup,
  resetDropdown,
}) => {
  const { styles, colors, spacing, fonts, responsive } = style;

  return (
    <View>
      <Dialog isVisible={isVisible}>
        <Dialog.Title
          title={isEditing ? "Edit" : "Create"}
          titleStyle={{ alignSelf: "center" }}
        />
        <Text
          style={[
            styles.textDark,
            {
              justifyContent: "center",
              marginBottom: 10,
              paddingLeft: 10,
            },
          ]}
        >
          {isEditing
            ? "Edit the details of the machine."
            : "Enter the details for the new machine."}
        </Text>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            saveData(values);
            setIsVisible(false);
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
              <CustomDropdown
                fieldName="machineGroupId"
                title="Machine Group"
                labels="MGroupName"
                values="MGroupID"
                data={dropmachineGroup}
                updatedropdown={handleChange("machineGroupId")}
                reset={resetDropdown}
                selectedValue={values.machineGroupId}
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

              <Input
                placeholder="Enter Machine Name"
                label="Machine Name"
                labelStyle={[styles.text, styles.textDark]}
                inputStyle={[styles.text, styles.textDark]}
                disabledInputStyle={styles.containerInput}
                onChangeText={handleChange("machineName")}
                onBlur={handleBlur("machineName")}
                value={values.machineName}
                rightIcon={
                  values.machineName ? (
                    <AntDesign
                      name="close"
                      size={20}
                      color={colors.palette.primary}
                      onPress={() => handleChange("machineName")("")}
                    />
                  ) : null
                }
                errorMessage={
                  touched.machineName && errors.machineName
                    ? errors.machineName
                    : undefined
                }
                errorStyle={{
                  left: -5,
                }}
              />

              <Input
                placeholder="Enter Description"
                label="Description"
                labelStyle={[styles.text, styles.textDark]}
                inputStyle={[styles.text, styles.textDark]}
                disabledInputStyle={styles.containerInput}
                onChangeText={handleChange("description")}
                onBlur={handleBlur("description")}
                value={values.description}
                rightIcon={
                  values.description ? (
                    <AntDesign
                      name="close"
                      size={20}
                      color={colors.palette.primary}
                      onPress={() => handleChange("description")("")}
                    />
                  ) : null
                }
                errorMessage={
                  touched.description && errors.description
                    ? errors.description
                    : undefined
                }
                errorStyle={{
                  left: -5,
                }}
              />

              <Input
                placeholder="Enter Display Order"
                label="Display Order"
                labelStyle={[styles.text, styles.textDark]}
                inputStyle={[styles.text, styles.textDark]}
                disabledInputStyle={styles.containerInput}
                onChangeText={handleChange("displayOrder")}
                onBlur={handleBlur("displayOrder")}
                value={values.displayOrder}
                rightIcon={
                  values.displayOrder ? (
                    <AntDesign
                      name="close"
                      size={20}
                      color={colors.palette.primary}
                      onPress={() => handleChange("displayOrder")("")}
                    />
                  ) : null
                }
                errorMessage={
                  touched.displayOrder && errors.displayOrder
                    ? errors.displayOrder
                    : undefined
                }
                errorStyle={{
                  left: -5,
                }}
              />

              <View style={styles.containerFlexStyle}>
                <Pressable
                  onPress={handleSubmit}
                  style={[
                    styles.button,
                    isValid && dirty ? styles.backMain : styles.backDis,
                  ]}
                  disabled={!isValid && !dirty}
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
      </Dialog>
    </View>
  );
};

export default Dialog_m;
