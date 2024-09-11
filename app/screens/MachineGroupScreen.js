import React, { useState, useCallback } from "react";
import { ScrollView, Text, View } from "react-native";
import axios from "../../config/axios";
import { Button, Card, Input } from "@rneui/themed";
import { CustomTable } from "../components";
import validator from "validator";
import { useTheme, useToast, useRes } from "../contexts";
import screenStyles from "../styles/screens/screen";
import { useFocusEffect } from "@react-navigation/native";

const MachineGroupScreen = () => {
  const [machineGroup, setMachineGroup] = useState([]);
  const [formState, setFormState] = useState({
    machineGroupId: "",
    machineGroupName: "",
    displayOrder: "",
    description: "",
  });
  const [error, setError] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { colors, fonts, spacing } = useTheme();
  const { Toast } = useToast();
  const { responsive } = useRes();
  const styles = screenStyles({ colors, spacing, fonts, responsive });

  console.log("MachineGroup");

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
          const [machineGroupResponse] = await Promise.all([
            axios.post("GetMachineGroups"),
          ]);
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

    if (fieldName === "machineGroupName" && validator.isEmpty(value.trim())) {
      errorMessage = "The Machine Group Name field is required.";
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
        if (!isEditing && key === "machineGroupId") {
          return true;
        }
        return value !== "" && String(value).trim() !== "";
      }) && Object.values(error).every((err) => err === "")
    );
  };

  const resetForm = () => {
    setFormState({
      machineGroupId: "",
      machineGroupName: "",
      displayOrder: "",
      description: "",
    });
    setError({});
    setIsEditing(false);
  };

  const saveData = async () => {
    setIsLoading(true);

    const data = {
      MGroupID: formState.machineGroupId,
      MGroupName: formState.machineGroupName,
      DisplayOrder: formState.displayOrder,
      Description: formState.description,
    };

    try {
      await axios.post("SaveMachineGroup", data);
      const response = await axios.post("GetMachineGroups");
      setMachineGroup(response.data.data ?? []);
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
        const response = await axios.post("GetMachineGroup", {
          MGroupID: item,
        });
        const machineGroupData = response.data.data[0] ?? {};
        setFormState({
          machineGroupId: machineGroupData.MGroupID ?? "",
          machineGroupName: machineGroupData.MGroupName ?? "",
          description: machineGroupData.Description ?? "",
          displayOrder: String(machineGroupData.DisplayOrder) ?? "",
        });
        setIsEditing(true);
      } else if (action === "delIndex") {
        await axios.post("DeleteMachineGroup", {
          MGroupID: item,
        });

        const response = await axios.post("GetMachineGroups");
        setMachineGroup(response.data.data ?? []);
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

  const tableData = machineGroup.map((item) => [
    item.MGroupName,
    item.Description,
    item.DisplayOrder,
    item.MGroupID,
    item.MGroupID,
  ]);

  const tableHead = [
    "Machine Group Name",
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

        <Input
          placeholder="Enter Machine Group Name"
          label="Machine Group Name"
          labelStyle={styles.text}
          inputStyle={styles.text}
          disabledInputStyle={styles.containerInput}
          onChangeText={(text) => handleChange("machineGroupName", text)}
          value={formState.machineGroupName}
        />
        {error.machineGroupName ? (
          <Text style={styles.errorText}>{error.machineGroupName}</Text>
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
          flexArr={[3, 4, 1, 1, 1]}
          actionIndex={[{ editIndex: 3, delIndex: 4 }]}
          handleAction={handleAction}
        />
      </Card>
    </ScrollView>
  );
};

export default MachineGroupScreen;
