import React from "react";
import { Text, View, Pressable } from "react-native";
import { Dialog } from "@rneui/themed";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import { CustomDropdown } from "../../index";
import { CustomDropdownMulti } from "../../index";

const validationSchema = Yup.object().shape({
  groupCheckListOptionId: Yup.string().required(
    "This group check list field is required"
  ),
  checkListOptionId: Yup.array()
    .of(Yup.string())
    .min(1, "The check list option filed least one option must be selected"),
});

const Dialog_mclo = ({
  style,
  isVisible,
  isEditing,
  initialValues,
  saveData,
  setIsVisible,
  dropgroupCheckListOption,
  dropcheckListOption,
}) => {
  const { styles } = style;
  console.log(initialValues);

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
            { justifyContent: "center", marginBottom: 10, paddingLeft: 10 },
          ]}
        >
          {isEditing
            ? "Edit the details of the match check list option."
            : "Enter the details for the new match check list option."}
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
                name="groupCheckListOptionId"
                component={({ field, form }) => (
                  <CustomDropdown
                    title="Group Check List Option"
                    labels="GCLOptionName"
                    values="GCLOptionID"
                    data={dropgroupCheckListOption}
                    selectedValue={values.groupCheckListOptionId}
                    onValueChange={(value) => {
                      setFieldValue(field.name, value);
                      form.setTouched({ ...form.touched, [field.name]: true });
                    }}
                  />
                )}
              />

              {touched.groupCheckListOptionId &&
              errors.groupCheckListOptionId ? (
                <Text
                  style={{
                    color: "red",
                    marginVertical: 10,
                    left: 10,
                    top: -10,
                  }}
                >
                  {errors.groupCheckListOptionId}
                </Text>
              ) : null}

              <Field
                name="checkListOptionId"
                component={({ field, form }) => (
                  <CustomDropdownMulti
                    title="Check List Option"
                    labels="CLOptionName"
                    values="CLOptionID"
                    data={dropcheckListOption}
                    selectedValue={values.checkListOptionId || []}
                    onValueChange={(value) => {
                      setFieldValue(field.name, value);
                      form.setTouched({ ...form.touched, [field.name]: true });
                      console.log("Dropdown Multi selected values: ", value);
                      console.log("Formik field: ", field);
                    }}
                  />
                )}
              />

              {touched.checkListOptionId && errors.checkListOptionId ? (
                <Text
                  style={{
                    color: "red",
                    marginVertical: 10,
                    left: 10,
                    top: -10,
                  }}
                >
                  {errors.checkListOptionId}
                </Text>
              ) : null}

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
      </Dialog>
    </View>
  );
};

export default Dialog_mclo;
