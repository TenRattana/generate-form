import { StyleSheet, ScrollView, Text, View } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import axios from "../../config/axios";
import { Button, Card, Input } from "@rneui/themed";
import { colors, spacing, fonts } from "../../theme";
import { CustomTable, useResponsive } from "../components";
import validator from "validator";
import { ToastContext } from "../contexts";

const ListDetailScreen = () => {
  const [listDetail, setListDetail] = useState([]);
  const [formState, setFormState] = useState({
    listDetailId: "",
    listDetailName: "",
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
        const [listDetailResponse] = await Promise.all([
          axios.post("GetListDetails"),
        ]);
        setListDetail(listDetailResponse.data.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (fieldName, value) => {
    let errorMessage = "";

    if (fieldName === "listDetailName" && validator.isEmpty(value.trim())) {
      errorMessage = "The List Detail Name field is required.";
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
        if (!isEditing && key === "listDetailId") {
          return true;
        }
        return value !== "" && value !== "" && String(value).trim() !== "";
      }) && Object.values(error).every((err) => err === "")
    );
  };

  const resetForm = () => {
    setFormState({ listDetailId: "", listDetailName: "" });
    setError({});
    setIsEditing(false);
  };

  const saveData = async () => {
    setIsLoading(true);
    const data = {
      LDetailID: formState.listDetailId,
      LDetailName: formState.listDetailName,
    };

    try {
      const responseData = await axios.post("SaveListDetail", data);
      const response = await axios.post("GetListDetails");
      setListDetail(response.data.data || []);
      resetForm();
    } catch (error) {
      console.error("Error inserting data:", error);
    }
    setIsLoading(false);
  };

  const handleAction = async (action, item) => {
    setIsLoading(true);
    let messageHeader = "";
    let message = "";
    let type = "";

    try {
      if (action === "edit") {
        const response = await axios.post("GetListDetail", {
          LDetailID: item,
        });
        const listDetailResponse = response.data.data[0] || {};

        messageHeader = response.data.status ? "Success" : "Error";
        message = response.data.message;
        type = response.data.status ? "success" : "error";

        setFormState({
          listDetailId: listDetailResponse.LDetailID || "",
          listDetailName: listDetailResponse.LDetailName || "",
        });
      } else if (action === "del") {
        const response1 = await axios.post("DeleteListDetail", {
          LDetailID: item,
        });
        const response2 = await axios.post("GetListDetails");
        setListDetail(response2.data.data || []);
      }
    } catch (error) {
      messageHeader = error.message;
      message = error.response.data.errors;
      type = "error";
    }
    // ShowMessages(messageHeader, message, type);
    setIsLoading(false);
  };

  const tableData = listDetail.map((item) => {
    return [item.LDetailName, item.LDetailID, item.LDetailID];
  });

  const tableHead = ["List Detail Name", "Edit", "Delete"];

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
        <Card.Title>Create Option</Card.Title>
        <Card.Divider />

        <Input
          placeholder="Enter List Detail Name"
          label="List Detail Name"
          labelStyle={styles.text}
          inputStyle={styles.text}
          disabledInputStyle={styles.containerInput}
          onChangeText={(text) => handleChange("listDetailName", text)}
          value={formState.listDetailName}
        />
        {error.listDetailName ? (
          <Text style={styles.errorText}>{error.listDetailName}</Text>
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
        <Card.Title>List Detail</Card.Title>
        <Card.Divider />
        <CustomTable
          Tabledata={tableData}
          Tablehead={tableHead}
          flexArr={[5, 1, 1]}
          editIndex={1}
          delIndex={2}
          handleAction={handleAction}
        />
      </Card>
    </ScrollView>
  );
};

export default ListDetailScreen;
