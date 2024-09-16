import React from "react";
import { Text, View, Pressable } from "react-native";
import { Dialog, Input } from "@rneui/themed";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import AntDesign from "@expo/vector-icons/AntDesign";

const validationSchema = Yup.object().shape({
  machineGroupName: Yup.string().required(
    "The machine group name field is required."
  ),
  description: Yup.string().required("The description field is required."),
  displayOrder: Yup.number()
    .typeError("The display order field must be numeric.")
    .required("The display order field is required."),
});

const Dialog_mg = ({
  style,
  isVisible,
  isEditing,
  initialValues,
  saveData,
  setIsVisible,
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
            ? "Edit the details of the machine group."
            : "Enter the details for the new machine group."}
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
              <Input
                placeholder="Enter Machine Group Name"
                label="Machine Group Name"
                labelStyle={[styles.text, styles.textDark]}
                inputStyle={[styles.text, styles.textDark]}
                disabledInputStyle={styles.containerInput}
                onChangeText={handleChange("machineGroupName")}
                onBlur={handleBlur("machineGroupName")}
                value={values.machineGroupName}
                rightIcon={
                  values.machineGroupName ? (
                    <AntDesign
                      name="close"
                      size={20}
                      color={colors.palette.primary}
                      onPress={() => handleChange("machineGroupName")("")}
                    />
                  ) : null
                }
                errorMessage={
                  touched.machineGroupName && errors.machineGroupName
                    ? errors.machineGroupName
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

export default Dialog_mg;
