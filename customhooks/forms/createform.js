import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../config/axios";
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
} from "../../slices";
import validator from "validator";
import formStyles from "../../styles/forms/form";
import { useTheme, useToast, useRes } from "../../contexts";

export const useFormBuilder = (route) => {
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
  const [checkList, setCheckList] = useState([]);
  const [groupCheckListOption, setGroupCheckListOption] = useState([]);
  const [checkListType, setCheckListType] = useState([]);
  const [dataType, setDataType] = useState([]);
  const { formId, machineId } = route.params || {};
  const [isLoading, setIsLoading] = useState(false);
  const { responsive } = useRes();
  const { Toast } = useToast();
  const { colors, spacing, fonts } = useTheme();
  const styles = formStyles({ colors, spacing, fonts, responsive });

  // Memoizing styles and Toast message function
  const ShowMessages = useCallback((textH, textT, color) => {
    Toast.show({
      type: "customToast",
      text1: textH,
      text2: textT,
      text1Style: [styles.text, { color: colors.palette.dark }],
      text2Style: [styles.text, { color: colors.palette.dark }],
    });
  }, [styles, Toast, colors.palette.dark]);

  // Fetch static data once
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          checkListResponse,
          groupCheckListOptionResponse,
          checkListTypeResponse,
          dataTypeResponse,
        ] = await Promise.all([
          axios.post("CheckList_service.asmx/GetCheckLists"),
          axios.post("GroupCheckListOption_service.asmx/GetGroupCheckListOptions"),
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
        ShowMessages(error.message || "Error", error.response?.data?.errors || ["Something wrong!"], "error");
      }
    };

    fetchData();
  }, []);

  // Fetch form data once dependencies are loaded
  useEffect(() => {
    if (isDataLoaded && (formId || machineId)) {
      const fetchFormData = async () => {
        let route = "";
        let data = {};

        if (formId) {
          data = { FormID: formId };
          route = "Form_service.asmx/GetForm";
        } else if (machineId) {
          data = { MachineID: machineId };
          route = "Form_service.asmx/GetFormView";
        }
        try {
          const formResponse = await axios.post(route, data);
          const formData = formResponse.data.data[0] ?? [];

          setForm({
            formId: formData.FormID,
            formName: formData.FormName,
            description: formData.Description,
          });

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
                machineId: "",
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
                  fields.push(field);
                });
              }
              subForms.push(subForm);
            });
          }

          dispatch(setSubForm({ subForms }));
          dispatch(setField({
            formState: fields,
            checkList,
            checkListType,
            groupCheckListOption,
            dataType,
          }));
        } catch (error) {
          ShowMessages(error.message || "Error", error.response?.data?.errors || ["Something wrong!"], "error");
        } finally {
          setIsLoading(false);
        }
      };

      fetchFormData();
    }
  }, [formId, machineId, isDataLoaded]);

  // Memoize saveForm to avoid recreating the function on every render
  const saveForm = useCallback(async () => {
    setIsLoading(true);

    const data = {
      SubFormData: JSON.stringify(state.subForms),
      FormData: JSON.stringify(form),
    };

    console.log(data);

    // You can uncomment the code below for saving
    // try {
    //   await axios.post("MatchCheckList_service.asmx/SaveFormCheckList", data);
    //   resetForm();
    // } catch (error) {
    //   ShowMessages(
    //     error.message || "Error",
    //     error.response ? error.response.data.errors : ["Something wrong!"],
    //     "error"
    //   );
    // } finally {
    //   setIsLoading(false);
    // }
  }, [form, state.subForms, ShowMessages]);

  return {
    form,
    subForm,
    formState,
    showDialogs,
    selectedIndex,
    groupCheckListOption,
    setForm,
    setSubInForm,
    setFormState,
    setShowDialogs,
    setSelectedIndex,
    isLoading,
    saveForm,
  };
};
