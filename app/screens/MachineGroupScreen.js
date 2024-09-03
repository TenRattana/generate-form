import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";
import { axios } from "../../config";
import { Button, Card, Input } from "@rneui/themed";
import { CustomTable } from "../components";
import validator from "validator";
import { useTheme, useToast } from "../contexts";
import { useIsFocused } from "@react-navigation/native";

const MachineGroupScreen = () => {
  const [machineGroup, setMachineGroup] = useState([]);
  const [formState, setFormState] = useState({
    mgroupId: "",
    mgroupName: "",
    displayOrder: "",
    description: "",
  });
  const [error, setError] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();

  const { Toast } = useToast();
  const { colors, fonts, spacing } = useTheme();

  useEffect(() => {
    if (isFocused) {
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
    }
  }, []);

  const handleChange = (fieldName, value) => {
    let errorMessage = "";

    if (fieldName === "mgroupName" && validator.isEmpty(value.trim())) {
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
      mgroupName: "",
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
      MGroupName: formState.mgroupName,
      DisplayOrder: formState.displayOrder,
      Description: formState.description,
    };

    try {
      await axios.post("SaveMachineGroup", data);
      const response = await axios.post("GetMachineGroups");
      setMachineGroup(response.data.data || []);
      resetForm();
    } catch (error) {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Error",
        text2: error.message,
      });
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
        const machineGroupData = response.data.data[0] || {};
        setFormState({
          mgroupId: machineGroupData.MGroupID || "",
          mgroupName: machineGroupData.MGroupName || "",
          description: machineGroupData.Description || "",
          displayOrder: String(machineGroupData.DisplayOrder) || "",
        });
        setIsEditing(true);
      } else if (action === "delIndex") {
        await axios.post("DeleteMachineGroup", {
          MGroupID: item,
        });

        const response = await axios.post("GetMachineGroups");
        setMachineGroup(response.data.data || []);
      }
    } catch (error) {
      // Handle error if necessary
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

  const styles = StyleSheet.create({
    scrollView: {
      flex: 1,
    },
    text: {
      fontSize: fonts.xsm,
      color: colors.text,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    containerButton: {
      width: 300,
      marginVertical: "1%",
      marginHorizontal: "2%",
    },
    containerInput: {
      backgroundColor: "darkgray",
      marginVertical: spacing.md,
    },
    errorText: {
      fontSize: fonts.xsm,
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
          onChangeText={(text) => handleChange("mgroupName", text)}
          value={formState.mgroupName}
        />
        {error.mgroupName ? (
          <Text style={styles.errorText}>{error.mgroupName}</Text>
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
            onPress={saveData} // เพิ่มวงเล็บ
            loading={isLoading}
          />
          <Button
            title="Reset"
            type="outline"
            titleStyle={styles.text}
            containerStyle={styles.containerButton}
            onPress={resetForm} // เพิ่มวงเล็บ
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
