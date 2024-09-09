import React, { useState, useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
import axios from "../../config/axios";
import { Button, Card, Input } from "@rneui/themed";
import { CustomTable, CustomDropdown } from "../components";
import validator from "validator";
import { useTheme, useToast, useRes } from "../contexts";
import screenStyles from "../styles/screens/screen";

const FormScreen = React.memo(({ navigation }) => {
  const [form, setForm] = useState([]);
  const [machine, setMachine] = useState([]);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [machineResponse, formResponse] = await Promise.all([
          axios.post("GetMachines"),
          axios.post("GetForms"),
        ]);
        setMachine(machineResponse.data.data ?? []);
        setForm(formResponse.data.data ?? []);
      } catch (error) {
        ShowMessages(error.message, error.response.data.errors, "error");
      }
    };

    fetchData();
  }, []);

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
      MGroupID: formState.machineGroupId,
      MachineName: formState.machineName,
      DisplayOrder: formState.displayOrder,
      Description: formState.description,
    };

    try {
      await axios.post("SaveForm", data);
      const response = await axios.post("GetMachines");
      setMachine(response.data.data ?? []);
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
        const response = await axios.post("GetMachine", { machineID: item });
        const machineData = response.data.data[0] ?? {};
        setFormState({
          machineId: machineData.MachineID ?? "",
          machineGroupId: machineData.MGroupID ?? "",
          machineName: machineData.MachineName ?? "",
          description: machineData.Description ?? "",
          displayOrder: String(machineData.DisplayOrder) ?? "",
        });
        setIsEditing(true);
      } else if (action === "delIndex") {
        const response1 = await axios.post("DeleteMatchList", {
          FormID: item,
        });
        const response = await axios.post("GetForms");
        setForm(response.data.data || []);
      } else if (action === "formIndex") {
        navigation.navigate("Create Form", { formIdforEdit: item });
      }
    } catch (error) {
      console.error("Error fetching question data:", error);
    }
    setIsLoading(false);
  };

  const handleNewForm = () => {
    navigation.navigate("Create Form");
  };
  const tableData = form.map((item) => {
    return [item.FormName, item.FormID, item.FormID, item.FormID];
  });

  const tableHead = ["Form Name", "Copy Template", "Edit", "Delete"];

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <Card>
        <Card.Title>List Form</Card.Title>
        <Card.Divider />

        <CustomDropdown
          fieldName="machineGroupId"
          title="Machine Group"
          labels="MGroupName"
          values="MGroupID"
          data={machine}
          updatedropdown={handleChange}
          reset={resetDropdown}
          selectedValue={formState.machineGroupId}
        />

        <CustomDropdown
          fieldName="machineGroupId"
          title="Machine Group"
          labels="MGroupName"
          values="MGroupID"
          data={machine}
          updatedropdown={handleChange}
          reset={resetDropdown}
          selectedValue={formState.machineGroupId}
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
          flexArr={[2, 2, 3, 1, 1, 1]}
          actionIndex={[{ editIndex: 4, delIndex: 5 }]}
          handleAction={handleAction}
        />
      </Card>
    </ScrollView>
  );
});

export default FormScreen;
