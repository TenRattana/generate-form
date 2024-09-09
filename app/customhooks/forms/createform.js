import { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../../config/axios";
import {
  setSubForm,
  addSubForm,
  updateSubForm,
  deleteSubForm,
  setField,
  addField,
  updateField,
  deleteField,
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
  const [subForm, setSubForm] = useState({
    subFormId: "",
    subFormName: "",
    formId: "",
    columns: "",
    displayOrder: "",
  });
  const [formState, setFormState] = useState({
    matchCheckListId: "",
    checkListId: "",
    matchCheckListOption: "",
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
  const [matchCheckListOption, setMatchCheckListOption] = useState([]);
  const [checkListType, setCheckListType] = useState([]);
  const [dataType, setDataType] = useState([]);
  const [shouldRender, setShouldRender] = useState("");
  const [shouldRenderDT, setShouldRenderDT] = useState("");
  const { formIdforEdit } = route.params || {};
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
        ShowMessages(
          checkListResponse.data.message,
          checkListResponse.data.data.map((e) => e.CListName),
          "error"
        );
      } catch (error) {
        ShowMessages(error.message, error.response.data.errors, "error");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isDataLoaded && formIdforEdit) {
      const fetchData = async () => {
        const data = { FormID: formIdforEdit || "" };
        try {
          const formResponse = await axios.post("GetForm", data);
          const formData = formResponse.data.data[0] ?? [];

          setForm({
            formId: formData.FormID,
            formName: formData.FormName,
            description: formData.Description,
          });

          const subForms = [];
          const fields = [];

          formData.forEach((item, index) => {
            const subForm = {
              subFormId: item.SFormID || "",
              subFormName: item.SFormName || "",
              formId: item.FormID || "",
              columns: item.Columns || "",
              displayOrder: item.DisplayOrder || "",
            };
            item.MatchCheckListOption.forEach((itemOption) => {
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

              fields.push({ field, index });
            });
            subForms.push(subForm);
          });

          dispatch(setSubForm({ subForm: subForms }));
          dispatch(
            setField({
              formState: fields,
              checkList,
              checkListType,
              matchCheckListOption,
            })
          );
        } catch (error) {
          ShowMessages(error.message, error.response.data.errors, "error");
        }
      };

      fetchData();
    }
  }, [formIdforEdit, isDataLoaded]);

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
    setSubForm((prevState) => ({ ...prevState, [field]: value }));
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
    setIsLoading(true);

    const data = {
      SubFormData: JSON.stringify(state.subForms),
      FormData: JSON.stringify(form),
    };

    try {
      await axios.post("SaveFormCheckList", data);
      resetForm();
    } catch (error) {
      ShowMessages(error.message, error.response.data.errors, "error");
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmit = () => {
    console.log(formData);
  };

  const saveSubForm = (option) => {
    const payload = { subForm };

    if (option === "add") {
      dispatch(addSubForm(payload));
    } else if (selectedIndex.subForm !== null) {
      payload.selectedSubFormIndex = selectedIndex.subForm;
      option === "delete"
        ? dispatch(deleteSubForm(payload))
        : dispatch(updateSubForm(payload));
    }

    resetForm();
  };

  const resetForm = () => {
    setFormState({
      matchCheckListId: "",
      checkListId: "",
      matchCheckListOption: "",
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
    setSubForm({
      subFormId: "",
      subFormName: "",
      formId: "",
      columns: "",
      displayOrder: "",
    });
    setError({});
    setShowDialogs({ subForm: false, field: false, save: false });
    setSelectedIndex({ subForm: null, field: null });
    setEditMode(false);
    setResetDropdown(true);
    setTimeout(() => setResetDropdown(false), 0);
  };

  const saveField = (option) => {
    const defaultDTypeID = dataType.find(
      (v) => v.DTypeName === "String"
    )?.DTypeID;

    formState.dataTypeId = formState.dataTypeId || defaultDTypeID;

    const payload = {
      formState,
      selectedSubFormIndex: selectedIndex.subForm,
      checkList,
      checkListType,
      dataType,
    };

    if (option === "add") {
      dispatch(addField(payload));
    } else if (selectedIndex.subForm !== null) {
      payload.selectedFieldIndex = selectedIndex.field;
      option === "delete"
        ? dispatch(deleteField(payload))
        : dispatch(updateField(payload));
    }
    resetForm();
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
    matchCheckListOption,
    checkListType,
    dataType,
    shouldRender,
    shouldRenderDT,
    ShowMessages,
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
    handleChange,
    matchCheckListOption,
    handleSubmit,
  };
};
