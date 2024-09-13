import React, { useEffect, useState, useCallback } from "react";
import { ScrollView, View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Layout2 } from "../../components/Forms";
import axios from "../../../config/axios";
import formStyles from "../../styles/forms/form";
import { setSubForm, setField, setExpected, reset } from "../../slices";
import { useTheme, useToast, useRes } from "../../contexts";
import { useFocusEffect } from "@react-navigation/native";

const ViewFormScreen = ({ route }) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.form);

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [checkList, setCheckList] = useState([]);
  const [groupCheckListOption, setGroupCheckListOption] = useState([]);
  const [checkListType, setCheckListType] = useState([]);
  const [dataType, setDataType] = useState([]);
  const [form, setForm] = useState([]);
  const [formData, setFormData] = useState({});
  const { colors, spacing, fonts } = useTheme();
  const { Toast } = useToast();
  const { responsive } = useRes();
  const [vform, setVForm] = useState({
    formId: "",
    formName: "",
    description: "",
  });
  const { formId, machineId } = route.params || {};

  const styles = formStyles({ route, colors, spacing, fonts, responsive });
  console.log("ViewForm");

  const ShowMessages = (textH, textT, color) => {
    Toast.show({
      type: "customToast",
      text1: textH,
      text2: textT,
      text1Style: [styles.text, { color: colors.palette.dark }],
      text2Style: [styles.text, { color: colors.palette.dark }],
    });
  };

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
        } catch (error) {
          ShowMessages(
            error.message || "Error",
            error.response ? error.response.data.errors : ["Something wrong!"],
            "error"
          );
        }
      };

      fetchData();

      return () => {
        dispatch(reset());
        setVForm({});
        setFormData({});
      };
    }, [])
  );

  useEffect(() => {
    if (isDataLoaded) {
      const fetchData = async () => {
        let route = "";
        let data = {};
        if (formId) {
          data = {
            FormID: formId,
          };
          route = "GetForm";
        } else if (machineId) {
          data = {
            MachineID: machineId,
          };
          route = "GetFormView";
        }
        try {
          const formResponse = await axios.post(route, data);
          const formData = formResponse.data.data[0] ?? [];

          setVForm({
            formId: formData.FormID,
            formName: formData.FormName,
            description: formData.Description,
          });

          const subForms = [];
          const fields = [];

          if (formData && formData.SubForm) {
            formData.SubForm.forEach((item) => {
              const subForm = {
                subFormId: item.SFormID || "",
                subFormName: item.SFormName || "",
                formId: item.FormID || "",
                columns: item.Columns || "",
                displayOrder: item.DisplayOrder || "",
                machineId: typeof formId === "object" ? formId.machine : "",
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
                    expectedResult: "",
                  };

                  fields.push({ field });
                });
              }
              subForms.push(subForm);
            });
          }

          const payloadSF = {
            subForms,
          };

          const payloadF = {
            formState: fields,
            checkList,
            checkListType,
            groupCheckListOption,
            dataType,
          };
          dispatch(setSubForm(payloadSF));
          dispatch(setField(payloadF));
        } catch (error) {
          ShowMessages(
            error.message || "Error",
            error.response ? error.response.data.errors : ["Something wrong!"],
            "error"
          );
        }
      };

      fetchData();
    }
  }, [formId, machineId, isDataLoaded]);

  const handleChange = (fieldName, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      formData,
    };
    dispatch(setExpected(payload));
    const data = {
      FormData: JSON.stringify(state.subForms),
    };

    try {
      await axios.post("SaveExpectedResult", data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.layout2, { width: "100%" }]}>
        <Layout2
          form={vform}
          style={{ styles, colors, spacing, fonts, responsive }}
          state={state}
          checkListType={checkListType}
          checkList={checkList}
          formData={formData}
          handleChange={handleChange}
          groupCheckListOption={groupCheckListOption}
          handleSubmit={handleSubmit}
        />
      </View>
    </ScrollView>
  );
};

export default ViewFormScreen;
