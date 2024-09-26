import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { View, Pressable, Animated, Easing, ScrollView } from "react-native";
import { Portal, Dialog, Text, Switch } from "react-native-paper";
import CustomDropdown from "../../Common/CustomDropdown";
import Inputs from "../../Common/Inputs";
import { Formik, Field } from "formik";

const FieldDialog = ({
  isVisible,
  formState,
  validationSchemaField,
  checkList,
  checkListType,
  dataType,
  onDeleteField,
  style,
  responsive,
  editMode,
  saveField,
  groupCheckListOption,
  setShowDialogs,
}) => {
  const { styles, colors, spacing } = style;
  const [shouldRender, setShouldRender] = useState("");
  const [shouldRenderDT, setShouldRenderDT] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnimDT = useRef(new Animated.Value(0)).current;

  const startAnimation = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.in,
      useNativeDriver: true,
    }).start();
  };
  const startAnimationDT = () => {
    Animated.timing(fadeAnimDT, {
      toValue: 1,
      duration: 800,
      easing: Easing.in,
      useNativeDriver: true,
    }).start();
  };
  const resetAnimation = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 0,
      useNativeDriver: true,
    }).start();
  };
  const resetAnimationDT = () => {
    Animated.timing(fadeAnimDT, {
      toValue: 0,
      duration: 0,
      useNativeDriver: true,
    }).start();
  };
  useEffect(() => {
    if (!editMode) {
      resetAnimation();
      startAnimation();
    }
  }, [shouldRender, editMode]);
  useEffect(() => {
    if (!editMode) {
      resetAnimationDT();
      startAnimationDT();
    }
  }, [shouldRenderDT, editMode]);

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

                const newRender = ["Dropdown", "Radio", "Checkbox"].includes(
                  checkListTypeItem
                )
                  ? "detail"
                  : ["Textinput", "Textarea"].includes(checkListTypeItem)
                  ? "text"
                  : "";

                if (newRender !== shouldRender) {
                  setShouldRender(newRender);
                }
              }, [values.checkListTypeId, shouldRender, setShouldRender]);

              useEffect(() => {
                const dataTypeItem = dataType.find(
                  (item) => item.DTypeID === values.dataTypeId
                )?.DTypeName;

                setShouldRenderDT(dataTypeItem === "Number");
              }, [values.dataTypeId, shouldRenderDT, setShouldRenderDT]);

              return (
                <View>
                  <ScrollView
                    contentContainerStyle={{
                      paddingBottom: 5,
                      paddingHorizontal: 10,
                    }}
                    showsVerticalScrollIndicator={false}
                    style={{
                      maxHeight: 330,
                    }}
                  >
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
                          lefticon={"check-all"}
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
                          lefticon={"card-text"}
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
                                lefticon={"format-list-group"}
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
                                lefticon={"text-recognition"}
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
                            style={[
                              styles.animatedText,
                              { opacity: fadeAnimDT },
                            ]}
                          >
                            {shouldRenderDT ? (
                              <React.Fragment>
                                <Inputs
                                  placeholder="Defalut 0"
                                  label="Digit Length"
                                  handleChange={handleChange("dataTypeValue")}
                                  handleBlur={handleBlur("dataTypeValue")}
                                  value={String(values.dataTypeValue)}
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

                                <Inputs
                                  placeholder="Enter Minimum Length"
                                  label="Minimum Length"
                                  handleChange={handleChange("minLength")}
                                  handleBlur={handleBlur("minLength")}
                                  value={String(values.minLength)}
                                  error={
                                    touched.minLength &&
                                    Boolean(errors.minLength)
                                  }
                                  errorMessage={
                                    touched.minLength ? errors.minLength : ""
                                  }
                                />

                                <Inputs
                                  placeholder="Enter Maximum Length"
                                  label="Maximum Length"
                                  handleChange={handleChange("maxLength")}
                                  handleBlur={handleBlur("maxLength")}
                                  value={String(values.maxLength)}
                                  error={
                                    touched.maxLength &&
                                    Boolean(errors.maxLength)
                                  }
                                  errorMessage={
                                    touched.maxLength ? errors.maxLength : ""
                                  }
                                />
                              </React.Fragment>
                            ) : (
                              false
                            )}
                          </Animated.View>

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
                      ) : (
                        false
                      )}
                    </Animated.View>
                  </ScrollView>
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
                      Required :
                    </Text>

                    <Switch
                      style={{ transform: [{ scale: 1.1 }], top: 2 }}
                      color={values.require ? colors.succeass : colors.disable}
                      value={values.require}
                      onValueChange={() =>
                        setFieldValue("require", !values.require)
                      }
                    />
                  </View>

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

                    {editMode ? (
                      <Pressable
                        onPress={() =>
                          onDeleteField(
                            values.subFormId,
                            values.matchCheckListId
                          )
                        }
                        style={[styles.button, styles.bwidth, styles.backMain]}
                      >
                        <Text
                          style={[
                            styles.textBold,
                            styles.text,
                            styles.textLight,
                          ]}
                        >
                          Delete field
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
              );
            }}
          </Formik>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

export default FieldDialog;
