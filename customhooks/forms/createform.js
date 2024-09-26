import { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../config/axios";
import { setSubForm, setField, reset } from "../../slices";
import formStyles from "../../styles/forms/form";
import { useTheme, useToast, useRes } from "../../contexts";
import { useFocusEffect } from "@react-navigation/native";

export const useFormBuilder = (route) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.form);

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [showDialogs, setShowDialogs] = useState({
    subForm: false,
    field: false,
    save: false,
  });
  const [form, setForm] = useState({
    formId: "",
    formName: "",
    description: "",
    machineId: "",
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
  const { formId, action } = route.params || {};

  const [isLoading, setIsLoading] = useState(false);
  const { responsive } = useRes();
  const { Toast } = useToast();
  const { colors, spacing, fonts } = useTheme();
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
          setCheckListType(
            checkListTypeResponse.data?.data.map((v) => {
              if (v.CTypeName === "Textinput") {
                return { ...v, icon: "format-text" };
              } else if (v.CTypeName === "Textarea") {
                return { ...v, icon: "text-long" };
              } else if (v.CTypeName === "Radio") {
                return { ...v, icon: "order-bool-ascending" };
              } else if (v.CTypeName === "Checkbox") {
                return { ...v, icon: "order-bool-ascending-variant" };
              } else if (v.CTypeName === "Dropdown") {
                return { ...v, icon: "format-list-group" };
              } else if (v.CTypeName === "Text") {
                return { ...v, icon: "format-color-text" };
              }
            }) ?? []
          );
          setDataType(
            dataTypeResponse.data?.data.map((v) =>
              v.DTypeName === "String"
                ? { ...v, icon: "format-color-text" }
                : { ...v, icon: "numeric" }
            ) ?? []
          );

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
              setForm({
                formId: formData.FormID,
                formName: formData.FormName,
                description: formData.Description,
                machineId: formData.MachineID || "",
              });
            } else {
              setForm({
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
      return () => {
        dispatch(reset());
      };
    }, [formId, isDataLoaded, action])
  );

  return {
    form,
    state,
    subForm,
    formState,
    showDialogs,
    checkList,
    checkListType,
    groupCheckListOption,
    dataType,
    setForm,
    ShowMessages,
    dispatch,
    setSubInForm,
    setFormState,
    setShowDialogs,
    isLoading,
  };
};
