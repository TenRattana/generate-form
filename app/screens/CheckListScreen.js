import React, { useState, useCallback } from "react";
import { ScrollView, Text, View } from "react-native";
import axios from "../../config/axios";
import { Button, Card, Input } from "@rneui/themed";
import { CustomTable } from "../components";
import validator from "validator";
import { useTheme, useToast, useRes } from "../contexts";
import screenStyles from "../styles/screens/screen";
import { useFocusEffect } from "@react-navigation/native";

const CheckListScreen = React.memo(() => {
  const [checkList, setCheckList] = useState([]);
  const [formState, setFormState] = useState({
    checkListId: "",
    checkListName: "",
  });
  const [error, setError] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { colors, fonts, spacing } = useTheme();
  const { Toast } = useToast();
  const { responsive } = useRes();
  const styles = screenStyles({ colors, spacing, fonts, responsive });
  console.log("ListScreen");

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
          const [checkListResponse] = await Promise.all([
            axios.post("GetCheckLists"),
          ]);
          setCheckList(checkListResponse.data.data ?? []);
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
        if (!isEditing && key === "checkListId") {
          return true;
        }
        return value !== "" && value !== "" && String(value).trim() !== "";
      }) && Object.values(error).every((err) => err === "")
    );
  };

  const resetForm = () => {
    setFormState({ checkListId: "", checkListName: "" });
    setError({});
    setIsEditing(false);
  };

  const saveData = async () => {
    setIsLoading(true);

    const data = {
      CListId: formState.checkListId,
      CListName: formState.checkListName,
    };

    try {
      await axios.post("SaveCheckList", data);
      const response = await axios.post("GetCheckLists");
      setCheckList(response.data.data ?? []);
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
        const response = await axios.post("GetCheckList", {
          CListID: item,
        });
        const checkListData = response.data.data[0] ?? {};

        setFormState({
          checkListId: checkListData.CListID ?? "",
          checkListName: checkListData.CListName ?? "",
        });
        setIsEditing(true);
      } else if (action === "delIndex") {
        await axios.post("DeleteCheckList", {
          CListID: item,
        });

        const response = await axios.post("GetCheckLists");
        setCheckList(response.data.data ?? []);
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

  const tableData = checkList.map((item) => {
    return [item.CListName, item.CListID, item.CListID];
  });

  const tableHead = ["Check List Name", "Edit", "Delete"];

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <Card>
        <Card.Title>Create List</Card.Title>
        <Card.Divider />
        <Input
          placeholder="Enter Check List Name"
          label="Check List Name"
          labelStyle={styles.text}
          inputStyle={styles.text}
          disabledInputStyle={styles.containerInput}
          value={formState.checkListName}
          onChangeText={(text) => handleChange("checkListName", text)}
        />
        {error.checkListName ? (
          <Text style={styles.errorText}>{error.checkListName}</Text>
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
});

export default CheckListScreen;
