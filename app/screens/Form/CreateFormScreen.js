import React from "react";
import { View } from "react-native";
import { useFormBuilder } from "../../../customhooks";
import { Layout1, Layout2, LoadingSpinner } from "../../components";
import formStyles from "../../../styles/forms/form";
import { useTheme, useToast, useRes } from "../../../contexts";

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
    checkListType,
    dataType,
    shouldRender,
    shouldRenderDT,
    formData,
    groupCheckListOption,
    isLoading,
    setEditMode,
    setShowDialogs,
    setSelectedIndex,
    setSubInForm,
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
  console.log("CreateForm");

  const layout1Props = {
    style: { styles, colors, spacing, fonts, responsive },
    state,
    handleSubForm,
    saveSubForm,
    subForm,
    form,
    error,
    shouldRender,
    shouldRenderDT,
    editMode,
    resetForm,
    setEditMode,
    setShowDialogs,
    showDialogs,
    setSelectedIndex,
    selectedIndex,
    setSubForm: setSubInForm,
    handleForm,
    saveForm,
    setFormState,
    formState,
    saveField,
    handleFieldChange,
    checkList,
    resetDropdown,
    checkListType,
    dataType,
    groupCheckListOption,
  };

  const layout2Props = {
    form,
    style: { styles, spacing, fonts, colors, responsive },
    state,
    checkListType,
    checkList,
    formData,
    handleChange,
    groupCheckListOption,
    handleSubmit,
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.layout1}>
          <View style={{ margin: 30 }}>
            <Layout1 {...layout1Props} />
          </View>
        </View>
        <View style={styles.layout2}>
          <Layout2 {...layout2Props} />
        </View>
      </View>
    );
  }

  return <LoadingSpinner />;
};

export default FormBuilder;
