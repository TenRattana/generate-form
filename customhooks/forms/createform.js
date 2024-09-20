import { useState, useEffect, useMemo } from "react";
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
  const [formData, setFormData] = useState({});
  const [error, setError] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [resetDropdown, setResetDropdown] = useState(false);
  const [checkList, setCheckList] = useState([]);
  const [groupCheckListOption, setGroupCheckListOption] = useState([]);
  const [checkListType, setCheckListType] = useState([]);
  const [dataType, setDataType] = useState([]);
  const [shouldRender, setShouldRender] = useState("");
  const [shouldRenderDT, setShouldRenderDT] = useState("");
  const { formId, machineId } = route.params || {};
  const [isLoading, setIsLoading] = useState(false);
  const { responsive } = useRes();
  const { Toast } = useToast();
  const { colors, spacing, fonts } = useTheme();
  const styles = formStyles({ colors, spacing, fonts, responsive });

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
          error.response ? error.response.data.errors : ["Something wrong!"],
          "error"
        );
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isDataLoaded && (formId || machineId)) {
      const fetchData = async () => {
        let route = "";
        let data = {};

        if (formId) {
          data = {
            FormID: formId,
          };
          route = "Form_service.asmx/GetForm";
        } else if (machineId) {
          data = {
            MachineID: machineId,
          };
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

          if (formData && formData.SubForm) {
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
        } finally {
          setIsLoading(true);
        }
      };

      fetchData();
    }
  }, [formId, machineId, isDataLoaded]);

  console.log(state);

  const handleSubForm = (field, value) => {
    let errorMessage = "";

    if (field === "subFormName" && validator.isEmpty(value.trim())) {
      errorMessage = "The Sub Form Name field is required.";
    }
    if (
      (field === "columns" || field === "displayOrder") &&
      !validator.isNumeric(value.trim())
    ) {
      errorMessage = `The Sub Form ${field} field must be numeric.`;
    }

    setError((prevError) => ({ ...prevError, [field]: errorMessage }));
    setSubInForm((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleForm = (field, value) => {
    setForm((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleFieldChange = (fieldName, value) => {
    setFormState((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const saveForm = async () => {
    setIsLoading(false);

    const data = {
      SubFormData: JSON.stringify(state.subForms),
      FormData: JSON.stringify(form),
    };
    console.log(data);

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
    //   setIsLoading(true);
    // }
  };
  const handleSubmit = () => {
    console.log(formData);
  };

  const saveSubForm = async (values, option) => {
    const payload = { subForm: values };

    try {
      if (option === "add") {
        dispatch(addSubForm(payload));
      } else if (selectedIndex.subForm !== null) {
        payload.selectedSubFormIndex = selectedIndex.subForm;
        option === "delete"
          ? dispatch(deleteSubForm(payload))
          : dispatch(updateSubForm(payload));
      }
    } catch (error) {
    } finally {
      setShowDialogs({
        subForm: false,
        field: false,
        save: false,
      });
    }
  };

  const resetForm = () => {
    setFormState({
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
    setError({});
    setShowDialogs({ subForm: false, field: false, save: false });
    setSelectedIndex({ subForm: null, field: null });
    setEditMode(false);
    setResetDropdown(true);
    setTimeout(() => setResetDropdown(false), 0);
  };

  const saveField = async (values, option) => {
    const defaultDTypeID = dataType.find(
      (v) => v.DTypeName === "String"
    )?.DTypeID;

    values.dataTypeId = values.dataTypeId || defaultDTypeID;

    const payload = {
      formState: values,
      selectedSubFormIndex: selectedIndex.subForm,
      checkList,
      checkListType,
      dataType,
    };
    try {
      if (option === "add") {
        dispatch(addField(payload));
      } else if (selectedIndex.subForm !== null) {
        payload.selectedFieldIndex = selectedIndex.field;
        option === "delete"
          ? dispatch(deleteField(payload))
          : dispatch(updateField(payload));
      }
    } catch (error) {
    } finally {
      setShowDialogs({
        subForm: false,
        field: false,
        save: false,
      });
    }
  };

  const handleChange = (fieldName, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  useMemo(() => {
    const checkListTypeItem = checkListType.find(
      (item) => item.CTypeID === formState.checkListTypeId
    )?.CTypeName;

    if (["Dropdown", "Radio", "Checkbox"].includes(checkListTypeItem)) {
      setShouldRender("detail");
    } else if (["Textinput", "Textaera"].includes(checkListTypeItem)) {
      setShouldRender("text");
    } else {
      setShouldRender(null);
    }
  }, [formState.checkListTypeId, checkListType]);

  useMemo(() => {
    const dataTypeItem = dataType.find(
      (item) => item.DTypeID === formState.dataTypeId
    )?.DTypeName;

    dataTypeItem === "Float"
      ? setShouldRenderDT(true)
      : setShouldRenderDT(false);
  }, [formState.dataTypeId, dataType]);

  return {
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
    formData,
    groupCheckListOption,
    checkListType,
    dataType,
    shouldRender,
    shouldRenderDT,
    isDataLoaded,
    isLoading,
    ShowMessages,
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
  };
};
