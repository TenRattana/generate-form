import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";
import { axios } from "../../config";
import { Button, Card, Input } from "@rneui/themed";
import { CustomTable, CustomDropdownMulti } from "../components";
import validator from "validator";
import { useTheme, useToast, useRes } from "../contexts";

const GroupCheckListOptionScreen = React.memo(() => {
  const [checkListOption, setCheckListOption] = useState([]);
  const [matchCheckListOption, setMatchCheckListOption] = useState([]);
  const [formState, setFormState] = useState({
    matchCheckListOptionId: "",
    matchCheckListOptionName: "",
    checkListOption: [],
    description: "",
    displayOrder: "",
  });
  const [error, setError] = useState({});
  const [resetDropdown, setResetDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { colors, fonts, spacing } = useTheme();
  const { Toast } = useToast();
  const { responsive } = useRes();
  console.log("GroupCheckListOptionScreen");
  console.log(formState);

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
        const [checkListOptionResponse, matchCheckListOptionResponse] =
          await Promise.all([
            axios.post("GetCheckListOptions"),
            axios.post("GetMatchCheckListOptions"),
          ]);
        setCheckListOption(checkListOptionResponse.data.data ?? []);
        setMatchCheckListOption(matchCheckListOptionResponse.data.data ?? []);
      } catch (error) {
        ShowMessages(error.message, error.response.data.errors, "error");
      }
    };

    fetchData();
  }, []);

  const handleChange = (fieldName, value) => {
    let errorMessage = "";

    if (
      fieldName === "matchCheckListOptionName" &&
      validator.isEmpty(value.trim())
    ) {
      errorMessage = "The Group Check List Option Name field is required.";
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
        if (!isEditing && key === "matchCheckListOptionId") {
          return true;
        }
        return value !== "" && value !== "" && String(value).trim() !== "";
      }) && Object.values(error).every((err) => err === "")
    );
  };

  const resetForm = () => {
    setFormState({
      matchCheckListOptionId: "",
      matchCheckListOptionName: "",
      checkListOption: [],
      description: "",
      displayOrder: "",
    });
    setError({});
    setIsEditing(false);
    setResetDropdown(true);
    setTimeout(() => setResetDropdown(false), 0);
  };

  const saveData = async () => {
    setIsLoading(true);

    const data = {
      MCLOptionID: formState.matchCheckListOptionId,
      MCLOptionName: formState.matchCheckListOptionName,
      Description: formState.description,
      DisplayOrder: formState.displayOrder,
      CLOptionID: JSON.stringify(formState.checkListOption),
    };

    try {
      await axios.post("SaveMatchCheckListOption", data);
      const response = await axios.post("GetMatchCheckListOptions");
      setMatchCheckListOption(response.data.data ?? []);
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
        const response = await axios.post("GetMatchCheckListOption", {
          MCLOptionID: item,
        });
        const matchCheckListOptionResponse = response.data.data[0] ?? {};

        setFormState({
          matchCheckListOptionId:
            matchCheckListOptionResponse.MCLOptionID ?? "",
          matchCheckListOptionName:
            matchCheckListOptionResponse.MCLOptionName ?? "",
          checkListOption: matchCheckListOptionResponse.CheckListOptions.map(
            (option) => option.CLOptionID
          ),
          description: matchCheckListOptionResponse.Description ?? "",
          displayOrder: matchCheckListOptionResponse.DisplayOrder ?? "",
        });

        setIsEditing(true);
      } else if (action === "delIndex") {
        await axios.post("DeleteMatchCheckListOption", {
          ID: item,
        });

        const response = await axios.post("GetMatchCheckListOptions");
        setMatchCheckListOption(response.data.data ?? []);
      }
    } catch (error) {
      ShowMessages(error.message, error.response.data.errors, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const tableData = matchCheckListOption.flatMap((item) =>
    item.CheckListOptions.map((option) => {
      const matchedOption = checkListOption.find(
        (group) => group.CLOptionID === option.CLOptionID
      );

      return [
        option.MCLOptionName,
        matchedOption?.CLOptionName,
        option.Description,
        option.DisplayOrder,
        option.MCLOptionID,
        option.ID,
      ];
    })
  );

  console.log(tableData);

  const tableHead = [
    "Group Option Name",
    "Option Name",
    "Description",
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
          onChangeText={(text) =>
            handleChange("matchCheckListOptionName", text)
          }
          value={formState.matchCheckListOptionName}
        />
        {error.matchCheckListOptionName ? (
          <Text style={styles.errorText}>{error.matchCheckListOptionName}</Text>
        ) : null}

        <CustomDropdownMulti
          fieldName="checkListOption"
          title="Machine Group"
          labels="CLOptionName"
          values="CLOptionID"
          data={checkListOption}
          updatedropdown={handleChange}
          reset={resetDropdown}
          selectedValue={formState.checkListOption}
        />

        {error.checkListOption ? (
          <Text style={styles.errorText}>{error.checkListOption}</Text>
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
          placeholder="Enter DisplayOrder"
          label="DisplayOrder"
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
        <Card.Title>List Detail</Card.Title>
        <Card.Divider />
        <CustomTable
          Tabledata={tableData}
          Tablehead={tableHead}
          flexArr={[3, 3, 5, 1, 1, 1]}
          actionIndex={[{ editIndex: 4, delIndex: 5 }]}
          handleAction={handleAction}
        />
      </Card>
    </ScrollView>
  );
});

export default GroupCheckListOptionScreen;
