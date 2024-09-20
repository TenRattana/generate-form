import React, { useRef, useEffect } from "react";
import {
  View,
  Pressable,
  FlatList,
  Text,
  Animated,
  Easing,
} from "react-native";
import { useFormBuilder } from "../../../customhooks";
import {
  Layout2,
  Inputs,
  SaveFormDialog,
  SubFormDialog,
  FieldDialog,
} from "../../components";
import formStyles from "../../../styles/forms/form";
import { useTheme, useToast, useRes } from "../../../contexts";
import { Formik } from "formik";
import * as Yup from "yup";
import { Entypo, AntDesign } from "@expo/vector-icons";

const validationSchemaForm = Yup.object().shape({
  formName: Yup.string().required("The form name field is required."),
  description: Yup.string().required("The description field is required."),
});

const FormBuilder = ({ route }) => {
  const {
    state,
    showDialogs,
    form,
    checkList,
    checkListType,
    formData,
    groupCheckListOption,
    subForm,
    editMode,
    formState,
    shouldRender,
    shouldRenderDT,
    dataType,
    setEditMode,
    setShowDialogs,
    setSelectedIndex,
    setSubInForm,
    saveForm,
    setFormState,
    handleChange,
    handleSubmit,
    saveSubForm,
    saveField,
  } = useFormBuilder(route);

  const { colors, spacing, fonts } = useTheme();
  const { responsive } = useRes();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnimDT = useRef(new Animated.Value(0)).current;
  const styles = formStyles({ colors, spacing, fonts, responsive });

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

  const renderSubForm = ({ item, index }) => (
    <View style={{ marginTop: 30 }} key={`subForm-${index}`}>
      <Pressable
        onPress={() => {
          setSubInForm(item);
          setSelectedIndex({ subForm: index });
          setShowDialogs((prev) => ({ ...prev, subForm: true }));
          setEditMode(true);
        }}
        style={[
          styles.button,
          styles.backSucceass,
          {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          },
        ]}
      >
        <Text style={[styles.text, styles.textLight, { paddingLeft: 15 }]}>
          Sub Form: {item.subFormName}
        </Text>
        <Entypo
          name="chevron-right"
          size={18}
          color={colors.palette.light}
          style={{ paddingRight: 15 }}
        />
      </Pressable>

      {item.fields.map((field, idx) => (
        <Pressable
          key={`${field.CheckListName}-${idx}`}
          onPress={() => {
            setSelectedIndex((prev) => ({
              ...prev,
              subForm: index,
              field: idx,
            }));
            setEditMode(true);
            setFormState(field);
            setShowDialogs((prev) => ({ ...prev, field: true }));
          }}
          style={styles.button}
        >
          <Text style={styles.text}>{field.CheckListName}</Text>
          <Entypo name="chevron-right" size={18} color={colors.palette.light} />
        </Pressable>
      ))}
      <Pressable
        onPress={() => {
          setSelectedIndex((prev) => ({ ...prev, subForm: index }));
          setShowDialogs((prev) => ({ ...prev, field: true }));
        }}
      >
        <Text style={[styles.button, { color: colors.palette.blue }]}>
          <AntDesign name="plus" size={16} color={colors.palette.blue} />
          Add Field
        </Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.layout1}>
        <Formik
          initialValues={form}
          validationSchema={validationSchemaForm}
          validateOnBlur={false}
          validateOnChange={true}
          onSubmit={saveForm}
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
            <View>
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
              <Pressable
                onPress={() =>
                  setShowDialogs((prev) => ({ ...prev, save: true }))
                }
                style={[
                  styles.button,
                  styles.backSucceass,
                  { opacity: isValid && dirty ? 1 : 0.5 },
                ]}
                disabled={!isValid || !dirty}
              >
                <Text style={[styles.text, styles.textLight]}>Save Form</Text>
              </Pressable>

              <SaveFormDialog
                isVisible={showDialogs.save}
                setShowDialogs={() =>
                  setShowDialogs((prev) => ({ ...prev, save: false }))
                }
                styles={styles}
                handleSubmit={handleSubmit}
              />
            </View>
          )}
        </Formik>

        <Pressable
          onPress={() => {
            setEditMode(false);
            setShowDialogs((prev) => ({ ...prev, subForm: true }));
            setSubInForm({
              subFormId: "",
              subFormName: "",
              formId: "",
              columns: "",
              displayOrder: "",
            });
          }}
          style={[
            styles.button,
            styles.backSucceass,
            { flexDirection: "row", alignItems: "center" },
          ]}
        >
          <AntDesign name="plus" size={16} color={colors.palette.blue} />
          <Text style={[styles.text, styles.textLight, { marginLeft: 5 }]}>
            Add Sub Form
          </Text>
        </Pressable>

        <FlatList
          data={state.subForms}
          renderItem={renderSubForm}
          keyExtractor={(item, index) => `subForm-${index}`}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <SubFormDialog
        isVisible={showDialogs.subForm}
        setShowDialogs={() =>
          setShowDialogs((prev) => ({ ...prev, subForm: false }))
        }
        editMode={editMode}
        styles={styles}
        subForm={subForm}
        saveSubForm={saveSubForm}
      />
      <FieldDialog
        isVisible={showDialogs.field}
        setShowDialogs={() =>
          setShowDialogs((prev) => ({ ...prev, field: false }))
        }
        editMode={editMode}
        styles={styles}
        formState={formState}
        saveField={saveField}
        fadeAnim={fadeAnim}
        fadeAnimDT={fadeAnimDT}
        shouldRender={shouldRender}
        shouldRenderDT={shouldRenderDT}
        checkList={checkList}
        checkListType={checkListType}
        dataType={dataType}
        responsive={responsive}
        groupCheckListOption={groupCheckListOption}
      />
      <View style={styles.layout2}>
        <Layout2
          form={form}
          style={{ styles, spacing, fonts, colors, responsive }}
          state={state}
          checkListType={checkListType}
          checkList={checkList}
          formData={formData}
          handleChange={handleChange}
          groupCheckListOption={groupCheckListOption}
          handleSubmit={handleSubmit}
        />
      </View>
    </View>
  );
};

export default FormBuilder;
