import React, { useEffect, useState, useCallback } from "react";
import { ScrollView, View, Text, Pressable } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Layout2, LoadingSpinner } from "../../components";
import axios from "../../../config/axios";
import formStyles from "../../../styles/forms/form";
import { setSubForm, setField, reset } from "../../../slices";
import { useTheme, useToast, useRes } from "../../../contexts";
import { useFocusEffect } from "@react-navigation/native";

const ScanFormScreen = ({ route }) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.form);

  const { colors, spacing, fonts } = useTheme();
  const { Toast } = useToast();
  const { responsive } = useRes();
  const styles = formStyles({ colors, spacing, fonts, responsive });

  const [formValues, setFormValues] = useState({});
  const [vform, setVForm] = useState({
    formId: "",
    formName: "",
    description: "",
  });

  const [formData, setFormData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [checkList, setCheckList] = useState([]);
  const [groupCheckListOption, setGroupCheckListOption] = useState([]);
  const [checkListType, setCheckListType] = useState([]);
  const [dataType, setDataType] = useState([]);
  const { machineId } = route.params || {};
  const [found, setFound] = useState(false);

  const ShowMessages = useCallback(
    (textH, textT) => {
      Toast.show({
        type: "customToast",
        text1: textH,
        text2: textT,
        text1Style: [styles.text, { color: colors.palette.dark }],
        text2Style: [styles.text, { color: colors.palette.dark }],
      });
    },
    [styles, Toast, colors.palette.dark]
  );

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const [
            checkListResponse,
            groupCheckListOptionResponse,
            checkListTypeResponse,
            dataTypeResponse,
          ] = await Promise.all([
            axios.post("CheckList_service.asmx/GetCheckLists"),
            axios.post(
              "GroupCheckListOption_service.asmx/GetGroupCheckListOptions"
            ),
            axios.post("CheckListType_service.asmx/GetCheckListTypes"),
            axios.post("DataType_service.asmx/GetDataTypes"),
          ]);

          setCheckList(checkListResponse.data.data || []);
          setGroupCheckListOption(groupCheckListOptionResponse.data.data || []);
          setCheckListType(checkListTypeResponse.data.data || []);
          setDataType(dataTypeResponse.data.data || []);
        } catch (error) {
          ShowMessages(
            error.message || "Error",
            error.response
              ? error.response.data.errors
              : ["Something went wrong!"],
            "error"
          );
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      const fetchFormData = async () => {
        if (!machineId) return;

        try {
          const response = await axios.post("Form_service.asmx/ScanForm", {
            MachineID: machineId,
          });
          const formData = response.data.data[0];

          if (formData && formData.FormID) {
            setVForm({
              formId: formData.FormID,
              formName: formData.FormName,
              description: formData.Description,
              machineId: formData.MachineID,
            });

            const fields =
              formData.SubForm?.flatMap(
                (item) =>
                  item.MatchCheckList?.map((itemOption) => ({
                    matchCheckListId: itemOption.MCListID,
                    checkListId: itemOption.CListID,
                    groupCheckListOptionId: itemOption.GCLOptionID,
                    checkListTypeId: itemOption.CTypeID,
                    dataTypeId: itemOption.DTypeID,
                    dataTypeValue: itemOption.DTypeValue,
                    subFormId: itemOption.SFormID,
                    require: itemOption.Required,
                    minLength: itemOption.MinLength,
                    maxLength: itemOption.MaxLength,
                    description: itemOption.Description,
                    placeholder: itemOption.Placeholder,
                    hint: itemOption.Hint,
                    displayOrder: itemOption.DisplayOrder,
                    expectedResult: "",
                  })) || []
              ) || [];

            dispatch(setSubForm({ subForms: formData.SubForm }));
            dispatch(
              setField({
                formState: fields,
                checkList,
                checkListType,
                groupCheckListOption,
                dataType,
              })
            );
            setFound(true);
          } else {
            setFound(false);
          }
        } catch (error) {
          ShowMessages(
            error.message || "Error",
            error.response
              ? error.response.data.errors
              : ["Something went wrong!"],
            "error"
          );
        }
      };

      fetchFormData();

      return () => {
        dispatch(reset());
      };
    }, [machineId, checkList, checkListType, groupCheckListOption, dataType])
  );

  const onFormSubmit = async () => {
    const updatedSubForms = state.subForms.map((subForm) => ({
      ...subForm,
      fields: subForm.fields.map((field) => ({
        ...field,
        expectedResult: formValues[field.matchCheckListId] || "",
      })),
    }));

    const data = { FormData: JSON.stringify(updatedSubForms) };

    try {
      await axios.post("ExpectedResult_service.asmx/SaveExpectedResult", data);
      ShowMessages("Success", "Form submitted successfully");
    } catch (error) {
      ShowMessages(
        error.message || "Error",
        error.response ? error.response.data.errors : ["Something went wrong!"],
        "error"
      );
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!found) {
    return (
      <View style={[styles.layout2]}>
        <Text>Form not found</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
    >
      <View style={[styles.layout2]}>
        <Layout2
          form={vform}
          style={{ styles, spacing, fonts, colors, responsive }}
          state={state}
          checkListType={checkListType}
          checkList={checkList}
          formData={formData}
          groupCheckListOption={groupCheckListOption}
          ShowMessages={ShowMessages}
          formValues={formValues}
          setFormValues={setFormValues}
        />
      </View>

      {state.subForms[0]?.fields.length > 0 && (
        <View style={styles.buttonContainer}>
          <Pressable
            onPress={onFormSubmit}
            style={[styles.button, styles.backMain]}
          >
            <Text style={[styles.textBold, styles.text, styles.textLight]}>
              Submit
            </Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
};

export default ScanFormScreen;
