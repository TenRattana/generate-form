import React from "react";
import { ScrollView, View, Text } from "react-native";
import { useSelector } from "react-redux";
import { useFormBuilder } from "../../customhooks";
import { Layout1, Layout2 } from "../../components";
import formStyles from "../../styles/forms/form";
import { useTheme, useToast, useRes } from "../../contexts";

const FormBuilder = ({ route }) => {
  const {
    state,
    showDialogs,
    selectedIndex,
    form,
    subForm,
    formState,
    error,
    editMode,
    resetDropdown,
    checkList,
    matchCheckListOption,
    checkListType,
    dataType,
    shouldRender,
    shouldRenderDT,
    formData,
    setEditMode,
    setShowDialogs,
    setSelectedIndex,
    setSubForm,
    setFormState,
    handleSubForm,
    handleForm,
    handleFieldChange,
    saveForm,
    saveSubForm,
    resetForm,
    saveField,
    handleChange,
    handleSubmit,
    ShowMessages,
  } = useFormBuilder(route);

  const { colors, spacing, fonts } = useTheme();
  const { Toast } = useToast();
  const { responsive } = useRes();

  const styles = formStyles({ colors, spacing, fonts, responsive });
  console.log(state);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.layout1}>
        <View style={{ margin: 30 }}>
          <Layout1
            style={{ styles, colors, responsive }}
            state={state}
            handleSubForm={handleSubForm}
            saveSubForm={saveSubForm}
            subForm={subForm}
            form={form}
            error={error}
            shouldRender={shouldRender}
            shouldRenderDT={shouldRenderDT}
            editMode={editMode}
            resetForm={resetForm}
            setEditMode={setEditMode}
            setShowDialogs={setShowDialogs}
            showDialogs={showDialogs}
            setSelectedIndex={setSelectedIndex}
            selectedIndex={selectedIndex}
            setSubForm={setSubForm}
            handleForm={handleForm}
            saveForm={saveForm}
            setFormState={setFormState}
            formState={formState}
            saveField={saveField}
            handleFieldChange={handleFieldChange}
            checkList={checkList}
            resetDropdown={resetDropdown}
            checkListType={checkListType}
            dataType={dataType}
            matchCheckListOption={matchCheckListOption}
          />
        </View>
      </View>
      <View style={styles.layout2}>
        <Layout2
          form={form}
          style={{ styles, colors, responsive }}
          state={state}
          checkListType={checkListType}
          checkList={checkList}
          formData={formData}
          handleChange={handleChange}
          matchCheckListOption={matchCheckListOption}
          handleSubmit={handleSubmit}
        />
      </View>
    </ScrollView>
  );
};

export default FormBuilder;
