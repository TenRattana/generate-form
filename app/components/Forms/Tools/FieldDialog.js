import React, { useState, useEffect } from "react";
import { View, Pressable } from "react-native";
import { Portal, Dialog, Text } from "react-native-paper";
import CustomDropdown from "../../Common/CustomDropdown";
import Inputs from "../../Common/Inputs";
import Animated from "react-native-reanimated";
import { Formik, Field } from "formik";
import * as Yup from "yup";

const FieldDialog = ({
  isVisible,
  fadeAnim,
  fadeAnimDT,
  formState,
  checkList,
  checkListType,
  dataType,
  styles,
  responsive,
  editMode,
  saveField,
  groupCheckListOption,
  setShowDialogs,
}) => {
  const [shouldRender, setShouldRender] = useState("");
  const [shouldRenderDT, setShouldRenderDT] = useState("");

  const validationSchemaField = Yup.object().shape({
    checkListId: Yup.string().required(
      "The machine group name field is required."
    ),
    checkListTypeId: Yup.string().required(
      "The description field is required."
    ),
    dataTypeId: Yup.string().when("checkListTypeId", {
      is: (checkListTypeId) => {
        const name = checkListType.find(
          (v) => v.CTypeID === checkListTypeId
        )?.CTypeName;
        return (
          name &&
          (name === "Radio" || name === "Checkbox" || name === "Dropdown")
        );
      },
      then: Yup.string().required("The data type field is required."),
      otherwise: Yup.string().nullable(),
    }),
    dataTypeValue: Yup.number().when("dataTypeId", {
      is: (dataTypeId) => {
        const type = dataType.find((v) => v.DTypeID === dataTypeId)?.DTypeName;
        return type && type === "Float";
      },
      then: Yup.number().required("The datatype value field is required."),
      otherwise: Yup.number().nullable(),
    }),
    displayOrder: Yup.number().required("The display order field is required."),
  });

  const dropcheckList = Array.isArray(checkList)
    ? checkList.filter((v) => v.IsActive)
    : [];
  const dropcheckListType = Array.isArray(checkListType)
    ? checkListType.filter((v) => v.IsActive)
    : [];
  const dropdataType = Array.isArray(dataType)
    ? dataType.filter((v) => v.IsActive)
    : [];
  const dropgroupCheckListOption = Array.isArray(groupCheckListOption)
    ? groupCheckListOption.filter((v) => v.IsActive)
    : [];

  return (
    <Portal>
      <Dialog
        visible={isVisible}
        onDismiss={() => setShowDialogs()}
        style={styles.containerDialog}
        contentStyle={styles.containerDialog}
      >
        <Dialog.Title style={{ paddingLeft: 8 }}>
          {editMode ? "Edit check list" : "Create check list"}
        </Dialog.Title>
        <Dialog.Content>
          <Text
            style={[styles.textDark, { marginBottom: 10, paddingLeft: 10 }]}
          >
            {editMode
              ? "Edit the details of the field."
              : "Enter the details for the new field."}
          </Text>

          <Formik
            initialValues={formState}
            validationSchema={validationSchemaField}
            validateOnBlur={false}
            validateOnChange={true}
            onSubmit={(values) => {
              saveField(values, editMode ? "update" : "add");
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
            }) => {
              useEffect(() => {
                const checkListTypeItem = checkListType.find(
                  (item) => item.CTypeID === values.checkListTypeId
                )?.CTypeName;

                if (
                  ["Dropdown", "Radio", "Checkbox"].includes(checkListTypeItem)
                ) {
                  setShouldRender("detail");
                } else if (
                  ["Textinput", "Textaera"].includes(checkListTypeItem)
                ) {
                  setShouldRender("text");
                } else {
                  setShouldRender("");
                }
              }, [values.checkListTypeId, checkListType]);

              useEffect(() => {
                const dataTypeItem = dataType.find(
                  (item) => item.DTypeID === values.dataTypeId
                )?.DTypeName;

                setShouldRenderDT(dataTypeItem === "Float");
              }, [values.dataTypeId, dataType]);

              return (
                <View>
                  <Field
                    name="checkListId"
                    component={({ field, form }) => (
                      <CustomDropdown
                        title="Check List"
                        labels="CListName"
                        values="CListID"
                        data={editMode ? checkList : dropcheckList}
                        selectedValue={values.checkListId}
                        onValueChange={(value) => {
                          setFieldValue(field.name, value);
                          form.setTouched({
                            ...form.touched,
                            [field.name]: true,
                          });
                        }}
                      />
                    )}
                  />
                  {touched.checkListId && errors.checkListId && (
                    <Text
                      style={[
                        styles.text,
                        styles.textError,
                        { marginLeft: spacing.xs, top: -spacing.xxs },
                      ]}
                    >
                      {errors.checkListId}
                    </Text>
                  )}

                  <Field
                    name="checkListTypeId"
                    component={({ field, form }) => (
                      <CustomDropdown
                        title="Check list Type"
                        labels="CTypeName"
                        values="CTypeID"
                        data={editMode ? checkListType : dropcheckListType}
                        selectedValue={values.checkListTypeId}
                        onValueChange={(value) => {
                          setFieldValue(field.name, value);
                          form.setTouched({
                            ...form.touched,
                            [field.name]: true,
                          });
                        }}
                      />
                    )}
                  />
                  {touched.checkListTypeId && errors.checkListTypeId && (
                    <Text
                      style={[
                        styles.text,
                        styles.textError,
                        { marginLeft: spacing.xs, top: -spacing.xxs },
                      ]}
                    >
                      {errors.checkListTypeId}
                    </Text>
                  )}

                  <Animated.View
                    style={[styles.animatedText, { opacity: fadeAnim }]}
                  >
                    {shouldRender === "detail" ? (
                      <React.Fragment>
                        <Field
                          name="groupCheckListOptionId"
                          component={({ field, form }) => (
                            <CustomDropdown
                              title="Match Check List Option Group"
                              labels="GCLOptionName"
                              values="GCLOptionID"
                              data={
                                editMode
                                  ? groupCheckListOption
                                  : dropgroupCheckListOption
                              }
                              selectedValue={values.groupCheckListOptionId}
                              onValueChange={(value) => {
                                setFieldValue(field.name, value);
                                form.setTouched({
                                  ...form.touched,
                                  [field.name]: true,
                                });
                              }}
                            />
                          )}
                        />
                        {touched.groupCheckListOptionId &&
                          errors.groupCheckListOptionId && (
                            <Text
                              style={[
                                styles.text,
                                styles.textError,
                                { marginLeft: spacing.xs, top: -spacing.xxs },
                              ]}
                            >
                              {errors.groupCheckListOptionId}
                            </Text>
                          )}
                      </React.Fragment>
                    ) : shouldRender === "text" ? (
                      <React.Fragment>
                        <Field
                          name="dataTypeId"
                          component={({ field, form }) => (
                            <CustomDropdown
                              title="Data Type"
                              labels="DTypeName"
                              values="DTypeID"
                              data={editMode ? dataType : dropdataType}
                              selectedValue={values.dataTypeId}
                              onValueChange={(value) => {
                                setFieldValue(field.name, value);
                                form.setTouched({
                                  ...form.touched,
                                  [field.name]: true,
                                });
                              }}
                            />
                          )}
                        />
                        {touched.dataTypeId && errors.dataTypeId && (
                          <Text
                            style={[
                              styles.text,
                              styles.textError,
                              { marginLeft: spacing.xs, top: -spacing.xxs },
                            ]}
                          >
                            {errors.dataTypeId}
                          </Text>
                        )}

                        <Animated.View
                          style={[styles.animatedText, { opacity: fadeAnimDT }]}
                        >
                          {shouldRenderDT && (
                            <Inputs
                              placeholder="Enter Digit Length"
                              label="Digit Length"
                              handleChange={handleChange("dataTypeValue")}
                              handleBlur={handleBlur("dataTypeValue")}
                              value={values.dataTypeValue}
                              error={
                                touched.dataTypeValue &&
                                Boolean(errors.dataTypeValue)
                              }
                              errorMessage={
                                touched.dataTypeValue
                                  ? errors.dataTypeValue
                                  : ""
                              }
                            />
                          )}
                        </Animated.View>

                        <Inputs
                          placeholder="Enter Minimum Length"
                          label="Minimum Length"
                          handleChange={handleChange("minLength")}
                          handleBlur={handleBlur("minLength")}
                          value={values.minLength}
                          error={touched.minLength && Boolean(errors.minLength)}
                          errorMessage={
                            touched.minLength ? errors.minLength : ""
                          }
                        />

                        <Inputs
                          placeholder="Enter Maximum Length"
                          label="Maximum Length"
                          handleChange={handleChange("maxLength")}
                          handleBlur={handleBlur("maxLength")}
                          value={values.maxLength}
                          error={touched.maxLength && Boolean(errors.maxLength)}
                          errorMessage={
                            touched.maxLength ? errors.maxLength : ""
                          }
                        />

                        <Inputs
                          placeholder="Enter Placeholder"
                          label="Placeholder"
                          handleChange={handleChange("placeholder")}
                          handleBlur={handleBlur("placeholder")}
                          value={values.placeholder}
                          error={
                            touched.placeholder && Boolean(errors.placeholder)
                          }
                          errorMessage={
                            touched.placeholder ? errors.placeholder : ""
                          }
                        />

                        <Inputs
                          placeholder="Enter Hint"
                          label="Hint"
                          handleChange={handleChange("hint")}
                          handleBlur={handleBlur("hint")}
                          value={values.hint}
                          error={touched.hint && Boolean(errors.hint)}
                          errorMessage={touched.hint ? errors.hint : ""}
                        />
                      </React.Fragment>
                    ) : null}
                  </Animated.View>

                  <Inputs
                    placeholder="Enter Display Order"
                    label="Display Order"
                    handleChange={handleChange("displayOrder")}
                    handleBlur={handleBlur("displayOrder")}
                    value={values.displayOrder}
                    error={touched.displayOrder && Boolean(errors.displayOrder)}
                    errorMessage={
                      touched.displayOrder ? errors.displayOrder : ""
                    }
                  />

                  <View
                    style={[
                      styles.containerButton,
                      {
                        flexDirection:
                          responsive === "small" ? "column" : "row",
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
                        {editMode ? "Update Field" : "Add Field"}
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
              );
            }}
          </Formik>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

export default FieldDialog;
