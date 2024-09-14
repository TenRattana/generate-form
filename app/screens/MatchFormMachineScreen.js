import React, { useState, useCallback } from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import axios from "../../config/axios";
import { Card } from "@rneui/themed";
import { CustomTable, CustomDropdown, LoadingSpinner } from "../components";
import validator from "validator";
import { useTheme, useToast, useRes } from "../contexts";
import screenStyles from "../styles/screens/screen";
import { useFocusEffect } from "@react-navigation/native";

const MatchFormMachineScreen = React.memo(({ navigation }) => {
  const [form, setForm] = useState([]);
  const [machine, setMachine] = useState([]);
  const [matchForm, setMatchForm] = useState([]);
  const [formState, setFormState] = useState({
    machineId: "",
    formId: "",
  });
  const [error, setError] = useState({});
  const [resetDropdown, setResetDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { colors, fonts, spacing } = useTheme();
  const { Toast } = useToast();
  const { responsive } = useRes();
  const styles = screenStyles({ colors, spacing, fonts, responsive });
  console.log("Forms");

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
          const [machineResponse, formResponse, matchFormResponse] =
            await Promise.all([
              axios.post("Machine_service.asmx/GetMachines"),
              axios.post("Form_service.asmx/GetForms"),
              axios.post("MatchFormMachine_service.asmx/GetMatchFormMachines"),
            ]);
          setMachine(machineResponse.data.data ?? []);
          setForm(formResponse.data.data ?? []);
          setMatchForm(matchFormResponse.data.data ?? []);
          setIsLoading(true);
        } catch (error) {
          ShowMessages(
            error.message || "Error",
            error.response
              ? error.response.data.errors
              : ["Something went wrong!"],
            "error"
          );
        }
      };

      fetchData();
      return () => {
        resetForm();
      };
    }, [])
  );

  const handleChange = (fieldName, value) => {
    let errorMessage = "";

    setError((prevError) => ({
      ...prevError,
      [fieldName]: errorMessage,
    }));

    setFormState((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const isFormValid = () => {
    return (
      Object.keys(formState).every((key) => {
        const value = formState[key];
        if (!isEditing && key === "machineId") {
          return true;
        }
        return value !== "" && String(value).trim() !== "";
      }) && Object.values(error).every((err) => err === "")
    );
  };

  const resetForm = () => {
    setFormState({
      machineId: "",
      formId: "",
      isActive: false,
    });
    setError({});
    setIsEditing(false);
    setResetDropdown(true);
    setTimeout(() => setResetDropdown(false), 0);
  };

  const saveData = async () => {
    const data = {
      MachineID: formState.machineId,
      FormID: formState.formId,
    };

    try {
      await axios.post("SaveForm", data);
      const response = await axios.post("GetMatchFormMachines");
      setMatchForm(response.data.data ?? []);
      resetForm();
    } catch (error) {
      ShowMessages(
        error.message || "Error",
        error.response ? error.response.data.errors : ["Something went wrong!"],
        "error"
      );
    } finally {
    }
  };

  const handleAction = async (action, item) => {
    try {
      if (action === "editIndex") {
        const response = await axios.post("GetMatchFormMachine", {
          MachineID: item,
        });
        const machineData = response.data.data[0] ?? {};
        setFormState({
          machineId: machineData.MachineID ?? "",
          formId: machineData.FormID ?? "",
        });
        setIsEditing(true);
      } else if (action === "delIndex") {
        const response1 = await axios.post("DeleteMatchForm", {
          FormID: item.form,
          MachineID: item.machine,
        });
        const response = await axios.post("GetMatchFormMachines");
        setMatchForm(response.data.data || []);
      } else if (action === "changeIndex") {
        navigation.navigate("Create Form", { machineId: item });
      } else if (action === "preIndex") {
        navigation.navigate("View Form", { machineId: item });
      }
    } catch (error) {
      ShowMessages(
        error.message || "Error",
        error.response ? error.response.data.errors : ["Something went wrong!"],
        "error"
      );
    }
  };

  const tableData = matchForm.map((item) => {
    return [
      item.MachineName,
      item.FormName,
      item.MachineID,
      item.MachineID,
      item.MachineID,
      item.MachineID,
      item.FormID,
    ];
  });

  const tableHead = [
    "Machine Name",
    "Form Name",
    "Change Form",
    "Copy Template",
    "Preview",
    "Edit",
    "Delete",
  ];

  let dropmachine = [];

  dropmachine =
    Array.isArray(machine) && machine.length > 0
      ? machine.filter((v) => v.IsActive)
      : dropmachine;

  let dropform = [];

  dropform =
    Array.isArray(form) && form.length > 0
      ? form.filter((v) => v.IsActive)
      : dropform;

  return (
    <View style={styles.scrollView}>
      <ScrollView>
        <Card>
          <Card.Title>List Form</Card.Title>
          <Card.Divider />

          <CustomDropdown
            fieldName="machineId"
            title="Machine"
            labels="MachineName"
            values="MachineID"
            data={dropmachine}
            updatedropdown={handleChange}
            reset={resetDropdown}
            selectedValue={formState.machineId}
          />

          <CustomDropdown
            fieldName="formId"
            title="Form"
            labels="FormName"
            values="FormID"
            data={dropform}
            updatedropdown={handleChange}
            reset={resetDropdown}
            selectedValue={formState.formId}
          />

          <View style={styles.containerFlexStyle}>
            <Pressable
              onPress={saveData}
              style={styles.buttonStyle}
              disabled={!isFormValid()}
            >
              <Text style={styles.text}>Create</Text>
            </Pressable>

            <Pressable onPress={resetForm} style={styles.buttonStyle}>
              <Text style={styles.text}>Reset</Text>
            </Pressable>
          </View>
        </Card>

        <Card>
          <Card.Title>List Machine</Card.Title>
          <Card.Divider />
          {isLoading ? (
            <CustomTable
              Tabledata={tableData}
              Tablehead={tableHead}
              flexArr={[2, 2, 1, 1, 1, 1, 1]}
              actionIndex={[
                {
                  changeIndex: 2,
                  copyIndex: 3,
                  preIndex: 4,
                  editIndex: 5,
                  delIndex: 6,
                },
              ]}
              handleAction={handleAction}
            />
          ) : (
            <LoadingSpinner />
          )}
        </Card>
      </ScrollView>
    </View>
  );
});

export default MatchFormMachineScreen;
