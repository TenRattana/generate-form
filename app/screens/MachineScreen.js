import React, { useState, useCallback } from "react";
import { ScrollView, Text, View } from "react-native";
import axios from "../../config/axios";
import { Button, Card, Input } from "@rneui/themed";
import { CustomTable, CustomDropdown } from "../components";
import validator from "validator";
import { useTheme, useToast, useRes } from "../contexts";
import screenStyles from "../styles/screens/screen";
import { useFocusEffect } from "@react-navigation/native";

const MachineScreen = () => {
  const [machine, setMachine] = useState([]);
  const [machineGroup, setMachineGroup] = useState([]);
  const [formState, setFormState] = useState({
    machineId: "",
    machineGroupId: "",
    machineName: "",
    displayOrder: "",
    description: "",
  });
  const [error, setError] = useState({});
  const [resetDropdown, setResetDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { colors, fonts, spacing } = useTheme();
  const { Toast } = useToast();
  const { responsive } = useRes();
  const styles = screenStyles({ colors, spacing, fonts, responsive });
  console.log("MachineScreen");

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
          const [machineResponse, machineGroupResponse] = await Promise.all([
            axios.post("GetMachines"),
            axios.post("GetMachineGroups"),
          ]);
          setMachine(machineResponse.data.data ?? []);
          setMachineGroup(machineGroupResponse.data.data ?? []);
        } catch (error) {
          ShowMessages(
            error.message || "Error",
            error.response ? error.response.data.errors : ["Something wrong!"],
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

    if (fieldName === "machineName" && validator.isEmpty(value.trim())) {
      errorMessage = "The Machine Name field is required.";
    } else if (
      fieldName === "displayOrder" &&
      !validator.isNumeric(value.trim())
    ) {
      errorMessage = "The Display Order field must be numeric.";
    }

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
      machineGroupId: "",
      machineName: "",
      displayOrder: "",
      description: "",
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
      await axios.post("SaveMachine", data);
      const response = await axios.post("GetMachines");
      setMachine(response.data.data ?? []);
      resetForm();
    } catch (error) {
      ShowMessages(
        error.message || "Error",
        error.response ? error.response.data.errors : ["Something wrong!"],
        "error"
      );
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
        await axios.post("DeleteMachine", {
          MachineID: item,
        });
        const response = await axios.post("GetMachines");
        setMachine(response.data.data ?? []);
      }
    } catch (error) {
      ShowMessages(
        error.message || "Error",
        error.response ? error.response.data.errors : ["Something wrong!"],
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const tableData = machine.map((item) => {
    return [
      machineGroup.find((group) => group.MGroupID === item.MGroupID)
        ?.MGroupName || "",
      item.MachineName,
      item.Description,
      item.DisplayOrder,
      item.MachineID,
      item.MachineID,
    ];
  });

  const tableHead = [
    "Machine Group Name",
    "Machine Name",
    "Description",
    "Priority",
    "Edit",
    "Delete",
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <Card>
        <Card.Title>Create Machine</Card.Title>
        <Card.Divider />

        <CustomDropdown
          fieldName="machineGroupId"
          title="Machine Group"
          labels="MGroupName"
          values="MGroupID"
          data={machineGroup}
          updatedropdown={handleChange}
          reset={resetDropdown}
          selectedValue={formState.machineGroupId}
        />

        {error.machineGroupId ? (
          <Text style={styles.errorText}>{error.machineGroupId}</Text>
        ) : null}

        <Input
          placeholder="Enter Machine Name"
          label="Machine Name"
          labelStyle={styles.text}
          inputStyle={styles.text}
          disabledInputStyle={styles.containerInput}
          onChangeText={(text) => handleChange("machineName", text)}
          value={formState.machineName}
        />
        {error.machineName ? (
          <Text style={styles.errorText}>{error.machineName}</Text>
        ) : null}

        <Input
          placeholder="Enter Description"
          label="Description"
          labelStyle={styles.text}
          inputStyle={styles.text}
          disabledInputStyle={styles.containerInput}
          onChangeText={(text) => handleChange("description", text)}
          value={formState.description}
        />
        {error.description ? (
          <Text style={styles.errorText}>{error.description}</Text>
        ) : null}

        <Input
          placeholder="Enter Display Order"
          label="Display Order"
          labelStyle={styles.text}
          inputStyle={styles.text}
          disabledInputStyle={styles.containerInput}
          onChangeText={(text) => handleChange("displayOrder", text)}
          value={formState.displayOrder}
        />
        {error.displayOrder ? (
          <Text style={styles.errorText}>{error.displayOrder}</Text>
        ) : null}

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
};

export default MachineScreen;
