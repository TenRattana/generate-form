import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";
import axios from "../../config/axios";
import { Button, Card, Input } from "@rneui/themed";
import { colors, spacing, fonts } from "../../theme";
import { CustomTable, CustomDropdown, useResponsive } from "../components";
import validator from "validator";
import { ToastContext } from "../contexts";

const MachineGroupScreen = () => {
  const [machineGroup, setMachineGroup] = useState([]);
  const [formState, setFormState] = useState({
    mgroupId: "",
    groupName: "",
    displayOrder: "",
    description: "",
  });
  const [error, setError] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const responsive = useResponsive();
  const { Toast } = useContext(ToastContext);

  const ShowMessages = (textH, textT, color) => {
    Toast.show({
      type: color,
      text1: textH,
      text2: textT,
      text1Style: [styles.text, { color: colors.palette.dark }],
      text2Style: [styles.text, { color: colors.palette.dark }],
    });
  };
  console.log("MachineGroupScreen");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [machineGroupResponse] = await Promise.all([
          axios.post("GetMachineGroups"),
        ]);
        setMachineGroup(machineGroupResponse.data.data || []);
      } catch (error) {
        ShowMessages(error.message, error.response.data.errors, "error");
      }
    };

    fetchData();
  }, []);

  const handleChange = (fieldName, value) => {
    let errorMessage = "";

    if (fieldName === "groupName" && validator.isEmpty(value.trim())) {
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
        if (!isEditing && key === "mgroupId") {
          return true;
        }
        return value !== "" && String(value).trim() !== "";
      }) && Object.values(error).every((err) => err === "")
    );
  };

  const resetForm = () => {
    setFormState({
      mgroupId: "",
      groupName: "",
      displayOrder: "",
      description: "",
    });
    setError({});
    setIsEditing(false);
  };

  const saveData = async () => {
    setIsLoading(true);

    const data = {
      MGroupID: formState.mgroupId,
      GroupName: formState.groupName,
      DisplayOrder: formState.displayOrder,
      Description: formState.description,
    };

    try {
      const responseData = await axios.post("SaveMachineGroup", data);

      const response = await axios.post("GetMachineGroups");
      setMachineGroup(response.data.data || []);
      resetForm();
    } catch (error) {}
    setIsLoading(false);
  };

  const handleAction = async (action, item) => {
    setIsLoading(true);

    try {
      if (action === "editIndex") {
        const response = await axios.post("GetMachineGroup", {
          MGroupID: item,
        });
        const machineGroupData = response.data.data[0] || {};
        setFormState({
          mgroupId: machineGroupData.MGroupID || "",
          groupName: machineGroupData.GroupName || "",
          description: machineGroupData.Description || "",
          displayOrder: String(machineGroupData.DisplayOrder) || "",
        });
        setIsEditing(true);
      } else if (action === "delIndex") {
        const responseData = await axios.post("DeleteMachineGroup", {
          MGroupID: item,
        });

        const response = await axios.post("GetMachineGroups");
        setMachineGroup(response.data.data || []);
      }
    } catch (error) {}
    setIsLoading(false);
  };

  const tableData = machineGroup.map((item) => {
    return [
      item.GroupName,
      item.Description,
      item.DisplayOrder,
      item.MGroupID,
      item.MGroupID,
    ];
  });

  const tableHead = [
    "Machine Group Name",
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
          onChangeText={(text) => handleChange("groupName", text)}
          value={formState.groupName}
        />
        {error.groupName ? (
          <Text style={styles.errorText}>{error.groupName}</Text>
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
            onPress={() => saveData}
            loading={isLoading}
          />
          <Button
            title="Reset"
            type="outline"
            titleStyle={styles.text}
            containerStyle={styles.containerButton}
            onPress={() => resetForm}
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
