import React, { useState, useCallback } from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import axios from "../../config/axios";
import { Card, Input } from "@rneui/themed";
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
            axios.post("MachineGroup_service.asmx/GetMachineGroups"),
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
      await axios.post("MachineGroup_service.asmx/SaveMachineGroup", data);
      const response = await axios.post(
        "MachineGroup_service.asmx/GetMachineGroups"
      );
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
        const response = await axios.post(
          "MachineGroup_service.asmx/GetMachineGroup",
          {
            MGroupID: item,
          }
        );
        const machineGroupData = response.data.data[0] ?? {};
        setFormState({
          machineGroupId: machineGroupData.MGroupID ?? "",
          machineGroupName: machineGroupData.MGroupName ?? "",
          description: machineGroupData.Description ?? "",
          displayOrder: String(machineGroupData.DisplayOrder) ?? "",
        });
        setIsEditing(true);
      } else {
        if (action === "activeIndex") {
          await axios.post("MachineGroup_service.asmx/ChangeMachineGroup", {
            MGroupID: item,
          });
        } else if (action === "delIndex") {
          await axios.post("MachineGroup_service.asmx/DeleteMachineGroup", {
            MGroupID: item,
          });
        }
        const response = await axios.post(
          "MachineGroup_service.asmx/GetMachineGroups"
        );
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
    item.IsActive,
    item.MGroupID,
    item.MGroupID,
    item.MGroupID,
  ]);

  const tableHead = [
    "Machine Group Name",
    "Description",
    "Priority",
    "",
    "Change Status",
    "Edit",
    "Delete",
  ];

  return (
    <View style={styles.scrollView}>
      <ScrollView>
        <Card>
          <Card.Title>Create Group Machine</Card.Title>
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
          <Card.Title>List Group Machine</Card.Title>
          <Card.Divider />
          <CustomTable
            Tabledata={tableData}
            Tablehead={tableHead}
            flexArr={[3, 4, 1, 1, 1, 1]}
            actionIndex={[{ activeIndex: 4, editIndex: 5, delIndex: 6 }]}
            handleAction={handleAction}
          />
        </Card>
      </ScrollView>
    </View>
  );
};

export default MachineGroupScreen;
