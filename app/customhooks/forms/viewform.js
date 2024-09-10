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

export const useViewForm = (route) => {
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
  const [forms, setForms] = useState([]);
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
        const data = { FormID: "F001" };
        const formResponse = await axios.post("GetForm", data);

        setForms(formResponse.data.data ?? []);
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
    handleForm,
    handleFieldChange,
    handleChange,
    matchCheckListOption,
    handleSubmit,
  };
};
