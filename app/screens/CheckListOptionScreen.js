import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";
import { axios } from "../../config";
import { Button, Card, Input } from "@rneui/themed";
import { CustomTable } from "../components";
import validator from "validator";
import { useTheme, useToast, useRes } from "../contexts";

const CheckListOptionScreen = React.memo(() => {
  const [checkListOption, setCheckListOption] = useState([]);
  const [formState, setFormState] = useState({
    checkListOptionId: "",
    checkListOptionName: "",
  });
  const [error, setError] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { colors, fonts, spacing } = useTheme();
  const { Toast } = useToast();
  const { responsive } = useRes();
  console.log("checkListOptionScreen");

  const ShowMessages = (textH, textT, color) => {
    Toast.show({
      type: "customToast",
      text1: textH,
      text2: textT,
      text1Style: [styles.text, { color: colors.palette.dark }],
      text2Style: [styles.text, { color: colors.palette.dark }],
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [checkListOptionResponse] = await Promise.all([
          axios.post("GetCheckListOptions"),
        ]);
        setCheckListOption(checkListOptionResponse.data.data ?? []);
      } catch (error) {
        ShowMessages(error.message, error.response.data.errors, "error");
      }
    };

    fetchData();
  }, []);

  const handleChange = (fieldName, value) => {
    let errorMessage = "";

    if (
      fieldName === "checkListOptionName" &&
      validator.isEmpty(value.trim())
    ) {
      errorMessage = "The Check List Option Name field is required.";
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
        if (!isEditing && key === "checkListOptionId") {
          return true;
        }
        return value !== "" && value !== "" && String(value).trim() !== "";
      }) && Object.values(error).every((err) => err === "")
    );
  };

  const resetForm = () => {
    setFormState({ checkListOptionId: "", checkListOptionName: "" });
    setError({});
    setIsEditing(false);
  };

  const saveData = async () => {
    setIsLoading(true);

    const data = {
      CLOptionID: formState.checkListOptionId,
      CLOptionName: formState.checkListOptionName,
    };

    try {
      await axios.post("SaveCheckListOption", data);
      const response = await axios.post("GetCheckListOptions");
      setCheckListOption(response.data.data ?? []);
      resetForm();
    } catch (error) {
      ShowMessages(error.message, error.response.data.errors, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (action, item) => {
    setIsLoading(true);

    try {
      if (action === "editIndex") {
        const response = await axios.post("GetCheckListOption", {
          CLOptionID: item,
        });
        const checkListOptionResponse = response.data.data[0] ?? {};

        setFormState({
          checkListOptionId: checkListOptionResponse.CLOptionID ?? "",
          checkListOptionName: checkListOptionResponse.CLOptionName ?? "",
        });
        setIsEditing(true);
      } else if (action === "delIndex") {
        await axios.post("DeleteCheckListOption", {
          CLOptionID: item,
        });

        const response = await axios.post("GetCheckListOptions");
        setCheckListOption(response.data.data ?? []);
      }
    } catch (error) {
      ShowMessages(error.message, error.response.data.errors, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const tableData = checkListOption.map((item) => {
    return [item.CLOptionName, item.CLOptionID, item.CLOptionID];
  });

  const tableHead = ["Check List Option Name", "Edit", "Delete"];

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
        <Card.Title>Create Option</Card.Title>
        <Card.Divider />

        <Input
          placeholder="Enter List Detail Name"
          label="List Detail Name"
          labelStyle={styles.text}
          inputStyle={styles.text}
          disabledInputStyle={styles.containerInput}
          onChangeText={(text) => handleChange("checkListOptionName", text)}
          value={formState.checkListOptionName}
        />
        {error.checkListOptionName ? (
          <Text style={styles.errorText}>{error.checkListOptionName}</Text>
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
          actionIndex={[{ editIndex: 1, delIndex: 2 }]}
          handleAction={handleAction}
        />
      </Card>
    </ScrollView>
  );
});

export default CheckListOptionScreen;
