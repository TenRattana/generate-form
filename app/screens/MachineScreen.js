import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";
import axios from "../../config/axios";
import { Button, Card, Input } from "@rneui/themed";
import { colors, spacing, fonts } from "../../theme";
import { CustomTable, CustomDropdown, useResponsive } from "../components";
import validator from "validator";

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
  const responsive = useResponsive();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [machineResponse, machineGroupResponse] = await Promise.all([
          axios.post("GetMachines"),
          axios.post("GetMachineGroups"),
        ]);
        setMachine(machineResponse.data || []);
        setMachineGroup(machineGroupResponse.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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
  };

  const saveData = async () => {
    setIsLoading(true);
    const data = {
      MachineID: formState.machineId,
      MachineGroupID: formState.machineGroupId,
      MachineName: formState.machineName,
      DisplayOrder: formState.displayOrder,
      Description: formState.description,
    };

    try {
      await axios.post("SaveMachine", data, {
        headers: { "Content-Type": "application/json" },
      });
      setFormState({
        machineId: "",
        machineGroupId: "",
        machineName: "",
        displayOrder: "",
        description: "",
      });
      setError({});
      const response = await axios.post("GetMachines");
      setMachine(response.data || []);
      setResetDropdown(true);
      setTimeout(() => setResetDropdown(false), 0);
      setIsEditing(true);
    } catch (error) {
      console.error("Error saving data:", error);
    }
    setIsLoading(false);
  };

  const handleAction = async (action, item) => {
    setIsLoading(true);
    try {
      if (action === "edit") {
        const response = await axios.post("GetMachine", { machineID: item });
        const machineData = response.data[0] || {};

        setFormState({
          machineId: machineData.MachineID || "",
          machineGroupId: machineData.MGroupID || "",
          machineName: machineData.MachineName || "",
          description: machineData.Description || "",
          displayOrder: String(machineData.DisplayOrder) || "",
        });
      } else if (action === "del") {
        await axios.post("DeleteMachine", {
          MachineID: item,
        });
        const response = await axios.post("GetMachines");
        setMachine(response.data || []);
      }
    } catch (error) {
      console.error("Error handling action:", error);
    }
    setIsLoading(false);
  };

  const tableData = machine.map((item) => {
    const group = machineGroup.find(
      (group) => group.MGroupID === item.MGroupID
    );
    return [
      group ? group.MGroupName : "",
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

  const styles = StyleSheet.create({
    scrollView: {
      flex: 1,
    },
    text: {
      fontSize:
        responsive === "small"
          ? fonts.xsm
          : responsive === "medium"
          ? fonts.sm
          : fonts.xsm,
      color: colors.text,
    },
    buttonContainer: {
      flexDirection: responsive === "large" ? "row" : "column",
      justifyContent: "center",
      alignItems: "center",
    },
    containerButton: {
      width: responsive === "large" ? 300 : "90%",
      marginVertical: "1%",
      marginHorizontal: "2%",
    },
    containerInput: {
      backgroundColor: "darkgray",
      marginVertical: spacing.md,
    },
    errorText: {
      fontSize:
        responsive === "small"
          ? fonts.xsm
          : responsive === "medium"
          ? fonts.sm
          : fonts.xsm,
      marginLeft: spacing.xs,
      top: -spacing.xxs,
      color: colors.danger,
    },
  });

  return (
    <ScrollView style={styles.scrollView}>
      <Card>
        <Card.Title>Create Machine</Card.Title>
        <Card.Divider />

        <CustomDropdown
          fieldName="machineGroupId"
          title="Machine Group"
          label="MGroup"
          data={machineGroup}
          updatedropdown={handleChange}
          reset={resetDropdown}
          selectedValue={formState.machineGroupId}
        />

        {error.machineGroupId ? (
          <Text style={styles.errorText}>{error.machineGroupId}</Text>
        ) : (
          false
        )}

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
        ) : (
          false
        )}

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
        ) : (
          false
        )}

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
        ) : (
          false
        )}

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
          editIndex={4}
          delIndex={5}
          handleAction={handleAction}
        />
      </Card>
    </ScrollView>
  );
};

export default MachineScreen;
