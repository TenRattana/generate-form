import React, { useEffect, useState, useCallback } from "react";
import { ScrollView, View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Layout2, LoadingSpinner } from "../../components";
import axios from "../../../config/axios";
import formStyles from "../../../styles/forms/form";
import { setSubForm, setField, setExpected, reset } from "../../../slices";
import { useTheme, useToast, useRes } from "../../../contexts";
import { useFocusEffect } from "@react-navigation/native";

const ViewFormScreen = ({ route }) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.form);

  const { colors, spacing, fonts } = useTheme();
  const { Toast } = useToast();
  const { responsive } = useRes();
  const styles = formStyles({ colors, spacing, fonts, responsive });
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
  const { formId, action } = route.params || {};

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
      return () => {
        dispatch(reset());
      };
    }, [])
  );

  useEffect(() => {
    if (isDataLoaded && formId) {
      const fetchFormData = async () => {
        let route = "";
        let data = {};

        if (formId) {
          data = { FormID: formId };
          route = "Form_service.asmx/GetForm";
        }
        try {
          const formResponse = await axios.post(route, data);
          const formData = formResponse.data.data[0] ?? [];

          if (action !== "copy") {
            setVForm({
              formId: formData.FormID,
              formName: formData.FormName,
              description: formData.Description,
              machineId: formData.MachineID || "",
            });
          } else {
            setVForm({
              formId: "",
              formName: "",
              description: "",
              machineId: "",
            });
          }

          const subForms = [];
          const fields = [];

          if (formData?.SubForm) {
            formData.SubForm.forEach((item) => {
              const subForm = {
                subFormId: item.SFormID || "",
                subFormName: item.SFormName || "",
                formId: item.FormID || "",
                columns: item.Columns || "",
                displayOrder: item.DisplayOrder || "",
                machineId: formData.MachineID || "",
              };
              if (item.MatchCheckList) {
                item.MatchCheckList.forEach((itemOption) => {
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
                    expectedResult: itemOption.EResult || "",
                  };
                  fields.push(field);
                });
              }
              subForms.push(subForm);
            });
          }

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
            error.response?.data?.errors || ["Something wrong!"],
            "error"
          );
        } finally {
          setIsLoading(false);
        }
      };

      fetchFormData();
    }
  }, [formId, isDataLoaded, action]);

  console.log(state);

  return (
    <View style={styles.scrollView}>
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
        />
      </View>
    </View>
  );
};

export default ViewFormScreen;
