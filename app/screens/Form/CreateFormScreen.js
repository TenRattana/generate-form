import React from "react";
import { ScrollView, View } from "react-native";
import { useSelector } from "react-redux";
import { useFormBuilder } from "../../customhooks";
import { Layout1 } from "../../components";
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
  } = useFormBuilder(route);

  const { colors, spacing, fonts } = useTheme();
  const { Toast } = useToast();
  const { responsive } = useRes();

  const styles = formStyles({ colors, spacing, fonts, responsive });

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
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default FormBuilder;
