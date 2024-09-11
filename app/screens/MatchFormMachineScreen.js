import React, { useState, useCallback } from "react";
import { ScrollView, Text, View } from "react-native";
import axios from "../../config/axios";
import { Button, Card, Input } from "@rneui/themed";
import { CustomTable, CustomDropdown } from "../components";
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
    isActive: false,
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
              axios.post("GetMachines"),
              axios.post("GetForms"),
              axios.post("GetMatchFormMachines"),
            ]);
          setMachine(machineResponse.data.data ?? []);
          setForm(formResponse.data.data ?? []);
          setMatchForm(matchFormResponse.data.data ?? []);
        } catch (error) {
          ShowMessages(error.message, error.response.data.errors, "error");
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
    setIsLoading(true);

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
      ShowMessages(error.message, error.response.data.errors, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (action, item) => {
    setIsLoading(true);
    try {
      if (action === "editIndex") {
        const response = await axios.post("GetMatchForm", {
          FormID: item.form,
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
        navigation.navigate("Create Form", { formIdforEdit: item });
      } else if (action === "preIndex") {
        navigation.navigate("View Form", { formId: item });
      }
    } catch (error) {
      console.error("Error fetching question data:", error);
    }
    setIsLoading(false);
  };

  const tableData = matchForm.map((item) => {
    return [
      item.MachineName,
      item.FormName,
      { machine: item.MachineID, form: item.FormID },
      { machine: item.MachineID, form: item.FormID },
      { machine: item.MachineID, form: item.FormID },
      { machine: item.MachineID, form: item.FormID },
      { machine: item.MachineID, form: item.FormID },
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

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <Card>
        <Card.Title>List Form</Card.Title>
        <Card.Divider />

        <CustomDropdown
          fieldName="machineId"
          title="Machine"
          labels="MachineName"
          values="MachineID"
          data={machine}
          updatedropdown={handleChange}
          reset={resetDropdown}
          selectedValue={formState.machineId}
        />

        <CustomDropdown
          fieldName="formId"
          title="Form"
          labels="FormName"
          values="FormID"
          data={form}
          updatedropdown={handleChange}
          reset={resetDropdown}
          selectedValue={formState.formId}
        />

        <View style={styles.buttonContainer}>
          <Button
            title="Create"
            type="outline"
            titleStyle={styles.text}
            containerStyle={styles.containerButton}
            disabled={!isFormValid()}
            onPress={saveData}
            loading={isLoading}
          />
          <Button
            title="Reset"
            type="outline"
            titleStyle={styles.text}
            containerStyle={styles.containerButton}
            onPress={resetForm}
          />
        </View>
      </Card>

      <Card>
        <Card.Title>List Machine</Card.Title>
        <Card.Divider />
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
      </Card>
    </ScrollView>
  );
});

export default MatchFormMachineScreen;
