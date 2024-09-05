import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
} from "react-native";
import { colors, spacing, fonts } from "../../../theme";
import { axios } from "../../../config";
import { useToast, useRes } from "../../contexts";
import { useSelector, useDispatch } from "react-redux";
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
import { Layout1 } from "./layouts";
import { formStyles } from "../../styles";
import validator from "validator";

const FormBuilder = ({ route }) => {
  const state = useSelector((state) => state.subForm);
  const field = useSelector((state) => state.field);
  const dispatch = useDispatch();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { formIdforEdit } = route.params || {};
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const { Toast } = useToast();
  const { responsive } = useRes();

  console.log(state);

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

  const [error, setError] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [checkList, setCheckList] = useState([]);
  const [matchCheckListOption, setMatchCheckListOption] = useState([]);
  const [checkListType, setCheckListType] = useState([]);
  const [dataType, setDataType] = useState([]);

  const [shouldRender, setShouldRender] = useState("");

  const styles = formStyles({ colors, spacing, fonts, responsive });

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
    [Toast, colors.palette.dark, styles.text]
  );

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

    setError((prevError) => ({
      ...prevError,
      [field]: errorMessage,
    }));

    setSubForm((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleForm = (field, value) => {
    setForm((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleFieldChange = (fieldName, value) => {
    setFormState((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };
  console.log("Create Form");

  const saveForm = async () => {
    console.log(state);
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
    setShowDialogs({
      subForm: false,
      field: false,
      save: false,
    });
    setSelectedIndex({
      subForm: null,
      field: null,
    });
    setEditMode(false);
  };

  const saveField = (option) => {
    const payload = {
      formState,
      selectedSubFormIndex: selectedIndex.subForm,
      checkListType,
      checkList,
      matchCheckListOption,
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

  useMemo(() => {
    const checkListTypeItem = checkListType.find(
      (item) => item.TypeID === formState.checkListTypeId
    )?.CTypeName;

    if (["Dropdown", "Radio", "Checkbox"].includes(checkListTypeItem)) {
      setShouldRender("detail");
    } else if (["Textinput", "Textaera"].includes(checkListTypeItem)) {
      setShouldRender("text");
    }
  }, [formState.checkListTypeId, checkListType]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.layout1}>
        <View style={{ margin: 30 }}>
          <Layout1
            style={{ styles, colors, responsive }}
            state={state}
            handleSubForm={handleSubForm}
            saveSubForm={saveSubForm}
            subForm={subForm}
            form={form}
            error={error}
            editMode={editMode}
            resetForm={resetForm}
            setEditMode={setEditMode}
            setShowDialogs={setShowDialogs}
            showDialogs={showDialogs}
            setSelectedIndex={setSelectedIndex}
            selectedIndex={selectedIndex}
            setSubForm={setSubForm}
            handleForm={handleForm}
            saveForm={saveForm}
            setFormState={setFormState}
            formState={formState}
            saveField={saveField}
            handleFieldChange={handleFieldChange}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default FormBuilder;
