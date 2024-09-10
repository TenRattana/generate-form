import React, { useEffect, useState } from "react";
import { ScrollView, View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Layout2 } from "../../components";
import axios from "../../../config/axios";
import formStyles from "../../styles/forms/form";
import { setSubForm, setField } from "../../slices";
import { useTheme, useToast, useRes } from "../../contexts";

const ViewFormScreen = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.form);

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [checkList, setCheckList] = useState([]);
  const [matchCheckListOption, setMatchCheckListOption] = useState([]);
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
  const styles = formStyles({ colors, spacing, fonts, responsive });
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          checkListResponse,
          matchCheckListOptionResponse,
          checkListTypeResponse,
          dataTypeResponse,
        ] = await Promise.all([
          axios.post("GetCheckLists"),
          axios.post("GetMatchCheckListOptions"),
          axios.post("GetCheckListTypes"),
          axios.post("GetDataTypes"),
        ]);
        setCheckList(checkListResponse.data.data ?? []);
        setMatchCheckListOption(matchCheckListOptionResponse.data.data ?? []);
        setCheckListType(checkListTypeResponse.data.data ?? []);
        setDataType(dataTypeResponse.data.data ?? []);
        setIsDataLoaded(true);
      } catch (error) {
        ShowMessages(error.message, error.response.data.errors, "error");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isDataLoaded) {
      const fetchData = async () => {
        const data = { FormID: "F001" };
        try {
          const formResponse = await axios.post("GetForm", data);
          const formData = formResponse.data.data[0] ?? [];

          setVForm({
            formId: formData.FormID,
            formName: formData.FormName,
            description: formData.Description,
          });

          const subForms = [];
          const fields = [];

          formData.SubForm.forEach((item) => {
            const subForm = {
              subFormId: item.SFormID || "",
              subFormName: item.SFormName || "",
              formId: item.FormID || "",
              columns: item.Columns || "",
              displayOrder: item.DisplayOrder || "",
            };

            item.MatchCheckList.forEach((itemOption) => {
              const field = {
                matchCheckListId: itemOption.MCListID || "",
                checkListId: itemOption.CListID || "",
                matchCheckListOption: itemOption.MCLOptionID || "",
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
              };

              fields.push({ field });
            });
            subForms.push(subForm);
          });

          const payloadSF = {
            subForms,
          };

          const payloadF = {
            formState: fields,
            checkList,
            checkListType,
            matchCheckListOption,
            dataType,
          };

          dispatch(setSubForm(payloadSF));
          dispatch(setField(payloadF));
        } catch (error) {
          ShowMessages(error.message, error.response.data.errors, "error");
        }
      };

      fetchData();
    }
  }, [isDataLoaded]);

  const handleChange = (fieldName, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const handleSubmit = () => {
    console.log(formData);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.layout2}>
        <Layout2
          form={vform}
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

export default ViewFormScreen;
