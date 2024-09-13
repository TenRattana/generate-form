import React, { useState, useCallback } from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import axios from "../../config/axios";
import { Card, Input } from "@rneui/themed";
import { CustomTable } from "../components";
import validator from "validator";
import { useTheme, useToast, useRes } from "../contexts";
import screenStyles from "../styles/screens/screen";
import { useFocusEffect } from "@react-navigation/native";

const GroupCheckListOptionScreen = React.memo(() => {
  const [groupCheckListOption, setGroupCheckListOption] = useState([]);
  const [formState, setFormState] = useState({
    groupCheckListOptionId: "",
    groupCheckListOptionName: "",
    description: "",
    displayOrder: "",
  });
  const [error, setError] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { colors, fonts, spacing } = useTheme();
  const { Toast } = useToast();
  const { responsive } = useRes();
  const styles = screenStyles({ colors, spacing, fonts, responsive });
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

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const [groupCheckListOptionResponse] = await Promise.all([
            axios.post(
              "GroupCheckListOption_service.asmx/GetGroupCheckListOptions"
            ),
          ]);
          setGroupCheckListOption(groupCheckListOptionResponse.data.data ?? []);
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

    if (
      fieldName === "groupCheckListOptionName" &&
      validator.isEmpty(value.trim())
    ) {
      errorMessage = "The Group Check List Option Name field is required.";
    } else if (fieldName === "description" && validator.isEmpty(value.trim())) {
      errorMessage = "The Description field is required.";
    } else if (
      fieldName === "displayOrder" &&
      !validator.isNumeric(value.trim())
    ) {
      errorMessage = "The Displat Order field must be numeric.";
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
        if (!isEditing && key === "groupCheckListOptionId") {
          return true;
        }
        return value !== "" && value !== "" && String(value).trim() !== "";
      }) && Object.values(error).every((err) => err === "")
    );
  };

  const resetForm = () => {
    setFormState({
      groupCheckListOptionId: "",
      groupCheckListOptionName: "",
      description: "",
      displayOrder: "",
    });
    setError({});
    setIsEditing(false);
  };

  const saveData = async () => {
    setIsLoading(true);

    const data = {
      GCLOptionID: formState.groupCheckListOptionId,
      GCLOptionName: formState.groupCheckListOptionName,
      Description: formState.description,
      DisplayOrder: formState.displayOrder,
    };

    try {
      await axios.post(
        "GroupCheckListOption_service.asmx/SaveGroupCheckListOption",
        data
      );
      const response = await axios.post(
        "GroupCheckListOption_service.asmx/GetGroupCheckListOptions"
      );
      setGroupCheckListOption(response.data.data ?? []);
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
          "GroupCheckListOption_service.asmx/GetGroupCheckListOption",
          {
            GCLOptionID: item,
          }
        );
        const groupCheckListOptionData = response.data.data[0] ?? {};
        setFormState({
          groupCheckListOptionId: groupCheckListOptionData.GCLOptionID ?? "",
          groupCheckListOptionName:
            groupCheckListOptionData.GCLOptionName ?? "",
          description: groupCheckListOptionData.Description ?? "",
          displayOrder: groupCheckListOptionData.DisplayOrder ?? "",
        });

        setIsEditing(true);
      } else {
        if (action === "activeIndex") {
          await axios.post(
            "GroupCheckListOption_service.asmx/ChangeGroupCheckListOption",
            {
              GCLOptionID: item,
            }
          );
        } else if (action === "delIndex") {
          await axios.post(
            "GroupCheckListOption_service.asmx/DeleteGroupCheckListOption",
            {
              GCLOptionID: item,
            }
          );
        }
        const response = await axios.post(
          "GroupCheckListOption_service.asmx/GetGroupCheckListOptions"
        );
        setGroupCheckListOption(response.data.data ?? []);
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

  const tableData = groupCheckListOption.map((item) => {
    return [
      item.GCLOptionName,
      item.Description,
      item.DisplayOrder,
      item.IsActive,
      item.GCLOptionID,
      item.GCLOptionID,
      item.GCLOptionID,
    ];
  });

  console.log(tableData);

  const tableHead = [
    "Group Option Name",
    "Description",
    "Display Order",
    "",
    "Change Status",
    "Edit",
    "Delete",
  ];

  return (
    <View style={styles.scrollView}>
      <ScrollView>
        <Card>
          <Card.Title>Create Group Option</Card.Title>
          <Card.Divider />

          <Input
            placeholder="Enter Group Option Name"
            label="Group Option Name"
            labelStyle={styles.text}
            inputStyle={styles.text}
            disabledInputStyle={styles.containerInput}
            onChangeText={(text) =>
              handleChange("groupCheckListOptionName", text)
            }
            value={formState.groupCheckListOptionName}
          />
          {error.groupCheckListOptionName ? (
            <Text style={styles.errorText}>
              {error.groupCheckListOptionName}
            </Text>
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
          <Card.Title>List Group Option</Card.Title>
          <Card.Divider />
          <CustomTable
            Tabledata={tableData}
            Tablehead={tableHead}
            flexArr={[3, 5, 1, 1, 1, 1, 1]}
            actionIndex={[{ activeIndex: 4, editIndex: 5, delIndex: 6 }]}
            handleAction={handleAction}
          />
        </Card>
      </ScrollView>
    </View>
  );
});

export default GroupCheckListOptionScreen;
