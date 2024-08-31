import { StyleSheet, ScrollView, Text, View } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import axios from "../../config/axios";
import { Button, Card, Input } from "@rneui/themed";
import { colors, spacing, fonts } from "../../theme";
import validator from "validator";
import { ToastContext } from "../contexts";
import { CustomTable, CustomDropdown, useResponsive } from "../components";

const ListScreen = ({ navigation }) => {
  const [form, setForm] = useState([]);
  const [machine, setMachine] = useState([]);
  const [matchForm, setMatchform] = useState([]);
  const [resetDropdown, setResetDropdown] = useState(false);
  const [formState, setFormState] = useState({
    machineId: "",
    formId: "",
    displayOrder: "",
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [formResponse, machineResponse, matchFormMachineResponse] =
          await Promise.all([
            axios.post("GetForms"),
            axios.post("GetMachines"),
            axios.post("GetMatchFormMachines"),
          ]);
        setForm(formResponse.data.data || []);
        setMachine(machineResponse.data.data || []);
        setMatchform(matchFormMachineResponse.data.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (fieldName, value) => {
    let errorMessage = "";

    if (fieldName === "listName" && validator.isEmpty(value.trim())) {
      errorMessage = "The List Name field is required.";
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
        if (!isEditing && key === "listId") {
          return true;
        }
        return value !== "" && value !== "" && String(value).trim() !== "";
      }) && Object.values(error).every((err) => err === "")
    );
  };

  const resetForm = () => {
    setFormState({ listId: "", listName: "" });
    setError({});
    setIsEditing(false);
  };

  const saveData = async () => {
    setIsLoading(true);
    const data = {
      ListId: formState.listId,
      ListName: formState.listName,
    };

    try {
      await axios.post("SaveList", data);
      const response = await axios.post("GetLists");
      setList(response.data.data || []);
      resetForm();
    } catch (error) {
      console.error("Error saving data:", error);
    }
    setIsLoading(false);
  };

  const handleAction = async (action, item, matchform) => {
    setIsLoading(true);

    try {
      if (action === "edit") {
        navigation.navigate("Create Form", {
          formIdforEdit: item,
          formIdMachine: matchform,
        });
      } else if (action === "del") {
        const response1 = await axios.post("DeleteMatchList", {
          FormID: item,
        });
        const response = await axios.post("GetMatchFormMachines");
        setForm(response.data.data || []);
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
      item.IsActive,
      item.DisplayOrder,
      item.MFMachineID,
      item.MFMachineID,
    ];
  });

  const tableHead = [
    "Machine Name",
    "Form Name",
    "IsActive",
    "Display Order",
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
        <Card.Title>Create Form in Machine</Card.Title>
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
        {error.machineId ? (
          <Text style={styles.errorText}>{error.machineId}</Text>
        ) : null}

        <CustomDropdown
          fieldName="formId"
          title="Form"
          labels="FormName"
          values="MFormID"
          data={form}
          updatedropdown={handleChange}
          reset={resetDropdown}
          selectedValue={formState.formId}
        />
        {error.formId ? (
          <Text style={styles.errorText}>{error.formId}</Text>
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
        <Card.Title>List Form in Machine</Card.Title>
        <Card.Divider />
        <CustomTable
          Tabledata={tableData}
          Tablehead={tableHead}
          editIndex={4}
          flexArr={[2, 3, 1, 1, 1, 1]}
          delIndex={5}
          handleAction={handleAction}
        />
      </Card>
    </ScrollView>
  );
};

export default ListScreen;
