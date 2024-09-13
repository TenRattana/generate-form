import React, { useState, useCallback } from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import axios from "../../config/axios";
import { Card, Input } from "@rneui/themed";
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
            axios.post("CheckList_service.asmx/GetCheckLists"),
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
      await axios.post("CheckList_service.asmx/SaveCheckList", data);
      const response = await axios.post("CheckList_service.asmx/GetCheckLists");
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
        const response = await axios.post(
          "CheckList_service.asmx/GetCheckList",
          {
            CListID: item,
          }
        );
        const checkListData = response.data.data[0] ?? {};
        setFormState({
          checkListId: checkListData.CListID ?? "",
          checkListName: checkListData.CListName ?? "",
        });
        setIsEditing(true);
      } else {
        if (action === "activeIndex") {
          await axios.post("CheckList_service.asmx/ChangeCheckList", {
            CListID: item,
          });
        } else if (action === "delIndex") {
          await axios.post("CheckList_service.asmx/DeleteCheckList", {
            CListID: item,
          });
        }

        const response = await axios.post(
          "CheckList_service.asmx/GetCheckLists"
        );
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
    return [
      item.CListName,
      item.IsActive,
      item.CListID,
      item.CListID,
      item.CListID,
    ];
  });

  const tableHead = ["Check List Name", "", "Change Status", "Edit", "Delete"];

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <Card>
        <Card.Title>Create Check List</Card.Title>
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
        <Card.Title>List Check List</Card.Title>
        <Card.Divider />
        <CustomTable
          Tabledata={tableData}
          Tablehead={tableHead}
          flexArr={[5, 1, 1, 1, 1]}
          actionIndex={[{ activeIndex: 2, editIndex: 3, delIndex: 4 }]}
          handleAction={handleAction}
        />
      </Card>
    </ScrollView>
  );
});

export default CheckListScreen;
