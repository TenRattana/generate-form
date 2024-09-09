import React from "react";
import { ScrollView, View, Text } from "react-native";
import { useSelector } from "react-redux";
import { Layout2 } from "../../components";
import formStyles from "../../styles/forms/form";
import { useTheme, useToast, useRes } from "../../contexts";
import { useViewForm } from "../../customhooks/forms/viewform";

const FormBuilder = ({ route }) => {
  const {
    state,
    form,
    checkList,
    matchCheckListOption,
    checkListType,
    formData,
    handleChange,
    handleSubmit,
  } = useViewForm(route);

  const { colors, spacing, fonts } = useTheme();
  const { Toast } = useToast();
  const { responsive } = useRes();

  const styles = formStyles({ colors, spacing, fonts, responsive });
  console.log("CreateForm");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.layout2}>
        {/* <Layout2
        form={form}
        style={{ styles, colors, responsive }}
        state={state}
        checkListType={checkListType}
        checkList={checkList}
        formData={formData}
        handleChange={handleChange}
        matchCheckListOption={matchCheckListOption}
        handleSubmit={handleSubmit}
        /> */}
      </View>
    </ScrollView>
  );
};

export default FormBuilder;
