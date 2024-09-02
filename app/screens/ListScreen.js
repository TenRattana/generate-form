import { StyleSheet, ScrollView, Text, View } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import axios from "../../config/axios";
import { Button, Card, Input } from "@rneui/themed";
import { CustomTable, useResponsive } from "../components";
import validator from "validator";
import { ThemeContext } from "../contexts";

const ListScreen = () => {
  const [list, setList] = useState([]);
  const [formState, setFormState] = useState({
    listId: "",
    listName: "",
  });
  const [error, setError] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const responsive = useResponsive();
  // const { Toast } = useContext(ToastContext);
  const { colors, fonts, spacing } = useContext(ThemeContext);
  console.log("ListScreen");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listResponse] = await Promise.all([axios.post("GetLists")]);
        setList(listResponse.data.data || []);
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

  const handleAction = async (action, item) => {
    setIsLoading(true);

    try {
      if (action === "editIndex") {
        const response = await axios.post("GetList", { ListID: item });
        const listData = response.data.data[0] || {};

        setFormState({
          listId: listData.ListID || "",
          listName: listData.ListName || "",
        });
        messageHeader = response.data.status ? "Success" : "Error";
        message = response.data.message;
        type = response.data.status ? "success" : "error";
      } else if (action === "delIndex") {
        await axios.post("DeleteList", {
          ListID: item,
        });
        const response2 = await axios.post("GetLists");
        setList(response2.data.data || []);
      }
    } catch (error) {}
    setIsLoading(false);
  };

  const tableData = list.map((item) => {
    return [item.ListName, item.ListID, item.ListID];
  });

  const tableHead = ["List Name", "Edit", "Delete"];

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
        <Card.Title>Create List</Card.Title>
        <Card.Divider />
        <Input
          placeholder="Enter List Name"
          label="List Name"
          labelStyle={styles.text}
          inputStyle={styles.text}
          disabledInputStyle={styles.containerInput}
          value={formState.listName}
          onChangeText={(text) => handleChange("listName", text)}
          readOnly={false}
        />
        {error.listName ? (
          <Text style={styles.errorText}>{error.listName}</Text>
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
        <Card.Title>List</Card.Title>
        <Card.Divider />
        <CustomTable
          Tabledata={tableData}
          Tablehead={tableHead}
          flexArr={[5, 1, 1]}
          actionIndex={[{ editIndex: 1, delIndex: 2 }]}
          handleAction={handleAction}
        />
      </Card>
    </ScrollView>
  );
};

export default ListScreen;
