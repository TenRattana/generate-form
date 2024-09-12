import React, { useState, useCallback } from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import axios from "../../config/axios";
import { Card } from "@rneui/themed";
import { CustomTable, CustomDropdown } from "../components";
import validator from "validator";
import { useTheme, useToast, useRes } from "../contexts";
import screenStyles from "../styles/screens/screen";
import { useFocusEffect } from "@react-navigation/native";

const MatchCheckListOptionScreen = React.memo(({ navigation }) => {
  const [checkListOption, setCheckListOption] = useState([]);
  const [groupCheckListOption, setGroupCheckListOption] = useState([]);
  const [matchCheckListOption, setMatchCheckListOption] = useState([]);
  const [formState, setFormState] = useState({
    matchCheckListOptionId: "",
    checkListOptionId: "",
    groupCheckListOptionId: "",
  });
  const [error, setError] = useState({});
  const [resetDropdown, setResetDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { colors, fonts, spacing } = useTheme();
  const { Toast } = useToast();
  const { responsive } = useRes();
  const styles = screenStyles({ colors, spacing, fonts, responsive });
  console.log("Forms");

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
          const [
            checkListOptionResponse,
            groupCheckListOptionResponse,
            matchCheckListOptionResponse,
          ] = await Promise.all([
            axios.post("GetCheckListOptions"),
            axios.post("GetGroupCheckListOptions"),
            axios.post("GetMatchCheckListOptions"),
          ]);
          setCheckListOption(checkListOptionResponse.data.data ?? []);
          setGroupCheckListOption(groupCheckListOptionResponse.data.data ?? []);
          setMatchCheckListOption(matchCheckListOptionResponse.data.data ?? []);
        } catch (error) {
          ShowMessages(error.message, error.response.data.errors, "error");
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
        return value !== "" && String(value).trim() !== "";
      }) && Object.values(error).every((err) => err === "")
    );
  };

  const resetForm = () => {
    setFormState({
      matchCheckListOptionId: "",
      checkListOptionId: "",
      groupCheckListOptionId: "",
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
      GCLOptionID: formState.groupCheckListOptionId,
      CLOptionID: formState.checkListOptionId,
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
        const matchCheckListOption = response.data.data[0] ?? {};
        setFormState({
          matchCheckListOptionId: matchCheckListOption.MCLOptionID ?? "",
          groupCheckListOptionId: matchCheckListOption.GCLOptionID ?? "",
          checkListOptionId: matchCheckListOption.CLOptionID ?? "",
        });
        setIsEditing(true);
      } else if (action === "delIndex") {
        const response1 = await axios.post("DeleteMatchCheckListOption", {
          MCLOptionID: item,
        });
        const response = await axios.post("GetMatchCheckListOptions");
        setMatchCheckListOption(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching question data:", error);
    }
    setIsLoading(false);
  };

  const tableData = matchCheckListOption.map((item) => {
    return [
      item.GCLOptionName,
      item.CLOptionName,
      item.MCLOptionID,
      item.MCLOptionID,
    ];
  });

  const tableHead = ["Group Name", "Option Name", "Edit", "Delete"];

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <Card>
        <Card.Title>List Form</Card.Title>
        <Card.Divider />

        <CustomDropdown
          fieldName="groupCheckListOptionId"
          title="Group Check List Option"
          labels="GCLOptionName"
          values="GCLOptionID"
          data={groupCheckListOption}
          updatedropdown={handleChange}
          reset={resetDropdown}
          selectedValue={formState.groupCheckListOptionId}
        />

        <CustomDropdown
          fieldName="checkListOptionId"
          title="Check List Option"
          labels="CLOptionName"
          values="CLOptionID"
          data={checkListOption}
          updatedropdown={handleChange}
          reset={resetDropdown}
          selectedValue={formState.checkListOptionId}
        />

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
        <Card.Title>List Machine</Card.Title>
        <Card.Divider />
        <CustomTable
          Tabledata={tableData}
          Tablehead={tableHead}
          flexArr={[4, 4, 1, 1]}
          actionIndex={[
            {
              editIndex: 2,
              delIndex: 3,
            },
          ]}
          handleAction={handleAction}
        />
      </Card>
    </ScrollView>
  );
});

export default MatchCheckListOptionScreen;
