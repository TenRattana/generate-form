import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../../config/axios";
import {
  setSubForm,
  setField,
  addSubForm,
  updateSubForm,
  deleteSubForm,
  addField,
  updateField,
  deleteField,
  reset,
} from "../../../slices";
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
import { ScrollView } from "react-native-web";

const validationSchemaForm = Yup.object().shape({
  formName: Yup.string().required("The form name field is required."),
  description: Yup.string().required("The description field is required."),
});

const FormBuilder = ({ route }) => {
  const {
    checkList,
    checkListType,
    groupCheckListOption,
    dataType,
    formData,
    saveForm,
    handleChange,
    handleSubmit,
    saveSubForm,
    saveField,
  } = useFormBuilder(route);

  const dispatch = useDispatch();
  const state = useSelector((state) => state.form);

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [showDialogs, setShowDialogs] = useState({
    subForm: false,
    field: false,
    save: false,
  });
  const [selectedIndex, setSelectedIndex] = useState({
    subForm: null,
    field: null,
  });
  const [form, setForm] = useState({
    formId: "",
    formName: "",
    description: "",
  });
  const [subForm, setSubInForm] = useState({
    subFormId: "",
    subFormName: "",
    formId: "",
    columns: "",
    displayOrder: "",
    machineId: "",
  });
  const [formState, setFormState] = useState({
    matchCheckListId: "",
    checkListId: "",
    groupCheckListOptionId: "",
    checkListTypeId: "",
    dataTypeId: "",
    dataTypeValue: "",
    subFormId: "",
    require: false,
    minLength: "",
    maxLength: "",
    description: "",
    placeholder: "",
    hint: "",
    displayOrder: "",
  });

  const [editMode, setEditMode] = useState(false);
  const { colors, spacing, fonts } = useTheme();
  const { responsive } = useRes();
  const styles = formStyles({ colors, spacing, fonts, responsive });

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
          styles.backLight,
          {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          },
        ]}
      >
        <Text style={[styles.text, styles.textDark, { paddingLeft: 15 }]}>
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
            {field.CheckListName}
          </Text>
          <Entypo
            name="chevron-right"
            size={18}
            color={colors.palette.light}
            style={{ paddingRight: 15 }}
          />
        </Pressable>
      ))}
      <Pressable
        onPress={() => {
          setSelectedIndex((prev) => ({ ...prev, subForm: index }));
          setShowDialogs((prev) => ({ ...prev, field: true }));
        }}
        style={[
          styles.button,
          styles.backLight,
          {
            flexDirection: "row",
            alignItems: "center",
          },
        ]}
      >
        <Text style={[styles.text, styles.textDark, { paddingLeft: 15 }]}>
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
          groupCheckListOption={groupCheckListOption}
          handleSubmit={handleSubmit}
        />
      </View>
    </View>
  );
};

export default FormBuilder;
