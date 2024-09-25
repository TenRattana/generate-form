import React, { useEffect, useState, useCallback } from "react";
import { ScrollView, View, Text, Pressable } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Layout2, LoadingSpinner } from "../../components";
import axios from "../../../config/axios";
import formStyles from "../../../styles/forms/form";
import { setSubForm, setField, setExpected, reset } from "../../../slices";
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

  console.log("ViewForm");
  const [formData, setFormData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [checkList, setCheckList] = useState([]);
  const [groupCheckListOption, setGroupCheckListOption] = useState([]);
  const [checkListType, setCheckListType] = useState([]);
  const [dataType, setDataType] = useState([]);
  const { formId, tableId } = route.params || {};

  const ShowMessages = useCallback(
    (textH, textT, color) => {
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

          setCheckList(checkListResponse.data.data ?? []);
          setGroupCheckListOption(groupCheckListOptionResponse.data.data ?? []);
          setCheckListType(checkListTypeResponse.data.data ?? []);
          setDataType(dataTypeResponse.data.data ?? []);
          setIsDataLoaded(true);
          setIsLoading(true);
        } catch (error) {
          ShowMessages(
            error.message || "Error",
            error.response?.data?.errors || ["Something wrong!"],
            "error"
          );
        }
      };

      fetchData();
      return () => {};
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      const fetchFormData = async () => {
        if (!isDataLoaded || (!formId && !tableId)) return;

        const requests = [];

        if (formId) {
          requests.push(
            axios.post("Form_service.asmx/GetForm", { FormID: formId })
          );
        }
        if (tableId) {
          requests.push(
            axios.post("ExpectedResult_service.asmx/GetExpectedResult", {
              TableID: tableId,
            })
          );
        }

        try {
          const responses = await Promise.all(requests);
          const formResponse = formId ? responses[0] : null;
          const expectedResultResponse = tableId
            ? responses[1].data.data[0]
            : null;

          const formData = formResponse?.data?.data[0] || {};

          setVForm({
            formId: formData.FormID || "",
            formName: formData.FormName || "",
            description: formData.Description || "",
            machineId: formData.MachineID || "",
          });

          const subForms = [];
          const fields = [];

          formData?.SubForm?.forEach((item) => {
            const subForm = {
              subFormId: item.SFormID || "",
              subFormName: item.SFormName || "",
              formId: item.FormID || "",
              columns: item.Columns || "",
              displayOrder: item.DisplayOrder || "",
              machineId: formData.MachineID || "",
            };
            subForms.push(subForm);

            item.MatchCheckList?.forEach((itemOption) => {
              const field = {
                matchCheckListId: itemOption.MCListID || "",
                checkListId: itemOption.CListID || "",
                groupCheckListOptionId: itemOption.GCLOptionID || "",
                checkListTypeId: itemOption.CTypeID || "",
                dataTypeId: itemOption.DTypeID || "",
                dataTypeValue: itemOption.DTypeValue || "",
                subFormId: itemOption.SFormID || "",
                require: itemOption.Required || false,
                minLength: itemOption.MinLength || "",
                maxLength: itemOption.MaxLength || "",
                description: itemOption.Description || "",
                placeholder: itemOption.Placeholder || "",
                hint: itemOption.Hint || "",
                displayOrder: itemOption.DisplayOrder || "",
                expectedResult:
                  expectedResultResponse?.[itemOption.MCListID] || "",
              };
              fields.push(field);
            });
          });

          dispatch(setSubForm({ subForms }));
          dispatch(
            setField({
              formState: fields,
              checkList,
              checkListType,
              groupCheckListOption,
              dataType,
            })
          );
        } catch (error) {
          ShowMessages(
            error.message || "Error",
            error.response?.data?.errors || ["Something went wrong!"],
            "error"
          );
        } finally {
          setIsLoading(false);
        }
      };

      fetchFormData();

      return () => {
        dispatch(reset());
      };
    }, [formId, tableId, isDataLoaded])
  );

  const onFormSubmit = async () => {
    const updatedSubForms = state.subForms.map((subForm) => ({
      ...subForm,
      fields: subForm.fields.map((field) => ({
        ...field,
        expectedResult: formValues[field.matchCheckListId] || "",
      })),
    }));

    const data = {
      FormData: JSON.stringify(updatedSubForms),
    };

    try {
      await axios.post("ExpectedResult_service.asmx/SaveExpectedResult", data);
    } catch (error) {
      ShowMessages(
        error.message || "Error",
        error.response ? error.response.data.errors : ["Something went wrong!"],
        "error"
      );
    }
  };

  return (
    <ScrollView
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled={true}
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
