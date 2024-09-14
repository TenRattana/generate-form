import React from "react";
import { Text, View, Pressable } from "react-native";
import { Dialog, Input } from "@rneui/themed";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import AntDesign from "@expo/vector-icons/AntDesign";

const Dialog_lg = ({
  style,
  isVisible,
  isEditing,
  initialValues,
  saveData,
  setIsVisible,
}) => {
  const { styles, colors, spacing, fonts, responsive } = style;

  const validationSchema = Yup.object().shape({
    checkListName: Yup.string().required(
      "The check list name field is required."
    ),
  });
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
            ? "Edit the details of the check list."
            : "Enter the details for the new check list."}
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
            <Form>
              <Input
                placeholder="Enter Check List"
                label="Machine Check List"
                labelStyle={[styles.text, styles.textDark]}
                inputStyle={[styles.text, styles.textDark]}
                disabledInputStyle={styles.containerInput}
                onChangeText={handleChange("checkListName")}
                onBlur={handleBlur("checkListName")}
                value={values.checkListName}
                rightIcon={
                  values.checkListName ? (
                    <AntDesign
                      name="close"
                      size={20}
                      color={colors.palette.primary}
                      onPress={() => handleChange("checkListName")("")}
                    />
                  ) : null
                }
              />
              {touched.checkListName && errors.checkListName && (
                <Text
                  style={[
                    styles.text,
                    styles.textError,
                    { marginLeft: spacing.xs, top: -spacing.xxs },
                  ]}
                >
                  {errors.checkListName}
                </Text>
              )}

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
            </Form>
          )}
        </Formik>
      </Dialog>
    </View>
  );
};

export default Dialog_lg;
