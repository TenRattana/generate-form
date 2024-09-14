import React, { useEffect, useState, useCallback } from "react";
import { ScrollView, View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Layout2 } from "../../components/Forms";
import { LoadingSpinner } from "../../components";
import axios from "../../../config/axios";
import formStyles from "../../styles/forms/form";
import { setSubForm, setField, setExpected, reset } from "../../slices";
import { useTheme, useToast, useRes } from "../../contexts";
import { useFormBuilder } from "../../customhooks";

const ViewFormScreen = ({ route }) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.form);

  const {
    checkList,
    checkListType,
    dataType,
    groupCheckListOption,
    ShowMessages,
    isDataLoaded,
  } = useFormBuilder(route);

  const [formData, setFormData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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
        } finally {
          setIsLoading(true);
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

  console.log(vform);

  return (
    <View style={styles.scrollView}>
      <ScrollView>
        <View style={[styles.layout2, { width: "100%" }]}>
          {isLoading ? (
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
          ) : (
            <LoadingSpinner />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ViewFormScreen;
