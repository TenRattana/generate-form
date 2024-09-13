import React, { useState, useCallback } from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import axios from "../../config/axios";
import { Card } from "@rneui/themed";
import {
  CustomTable,
  CustomDropdown,
  CustomDropdownMulti,
} from "../components";
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
    checkListOptionId: [],
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
            axios.post("CheckListOption_service.asmx/GetCheckListOptions"),
            axios.post(
              "GroupCheckListOption_service.asmx/GetGroupCheckListOptions"
            ),
            axios.post(
              "MatchCheckListOption_service.asmx/GetMatchCheckListOptions"
            ),
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
      checkListOptionId: [],
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
      CLOptionID: JSON.stringify(formState.checkListOptionId),
    };

    console.log(data);

    try {
      await axios.post(
        "MatchCheckListOption_service.asmx/SaveMatchCheckListOption",
        data
      );
      const response = await axios.post(
        "MatchCheckListOption_service.asmx/GetMatchCheckListOptions"
      );
      setMatchCheckListOption(response.data.data ?? []);
      resetForm();
    } catch (error) {
      ShowMessages(error.message, error.response.data.errors, "error");
    } finally {
      setIsLoading(false);
    }
  };

  console.log(formState);

  const handleAction = async (action, item) => {
    setIsLoading(true);
    try {
      if (action === "editIndex") {
        const response = await axios.post(
          "MatchCheckListOption_service.asmx/GetMatchCheckListOption",
          {
            MCLOptionID: item,
          }
        );
        const matchCheckListOption = response.data.data[0] ?? {};
        setFormState({
          matchCheckListOptionId: matchCheckListOption.MCLOptionID ?? "",
          groupCheckListOptionId: matchCheckListOption.GCLOptionID ?? "",
          checkListOptionId:
            matchCheckListOption.CheckListOptions.map((v) => v.CLOptionID) ??
            [],
        });
        setIsEditing(true);
      } else {
        if (action === "activeIndex") {
          await axios.post(
            "MatchCheckListOption_service.asmx/ChangeMatchCheckListOption",
            {
              MCLOptionID: item,
            }
          );
        } else if (action === "delIndex") {
          await axios.post(
            "MatchCheckListOption_service.asmx/DeleteMatchCheckListOption",
            {
              MCLOptionID: item,
            }
          );
        }

        const matchCheckListData = await axios.post(
          "MatchCheckListOption_service.asmx/GetMatchCheckListOptions"
        );
        setMatchCheckListOption(matchCheckListData.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching question data:", error);
    }
    setIsLoading(false);
  };

  const tableData = matchCheckListOption.flatMap((item) =>
    item.CheckListOptions.map((option) => {
      const matchedOption = checkListOption.find(
        (group) => group.CLOptionID === option.CLOptionID
      );

      return [
        item.GCLOptionName,
        matchedOption?.CLOptionName,
        item.IsActive,
        item.MCLOptionID,
        item.MCLOptionID,
        item.MCLOptionID,
      ];
    })
  );

  const tableHead = [
    "Group Name",
    "Option Name",
    "",
    "Change Status",
    "Edit",
    "Delete",
  ];

  let dropcheckListOption = [];
  dropcheckListOption =
    checkListOption.length > 0
      ? checkListOption.filter((v) => v.IsActive)
      : dropcheckListOption;

  let dropgroupCheckListOption = [];
  dropgroupCheckListOption =
    groupCheckListOption.length > 0
      ? groupCheckListOption.filter((v) => v.IsActive)
      : dropgroupCheckListOption;

  return (
    <View style={styles.scrollView}>
      <ScrollView>
        <Card>
          <Card.Title>Create Match Group & Option</Card.Title>
          <Card.Divider />

          <CustomDropdown
            fieldName="groupCheckListOptionId"
            title="Group Check List Option"
            labels="GCLOptionName"
            values="GCLOptionID"
            data={dropgroupCheckListOption}
            updatedropdown={handleChange}
            reset={resetDropdown}
            selectedValue={formState.groupCheckListOptionId}
          />

          <CustomDropdownMulti
            fieldName="checkListOptionId"
            title="Check List Option"
            labels="CLOptionName"
            values="CLOptionID"
            data={dropcheckListOption}
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
          <Card.Title>List Match Group & Option</Card.Title>
          <Card.Divider />
          <CustomTable
            Tabledata={tableData}
            Tablehead={tableHead}
            flexArr={[4, 4, 1, 1, 1, 1]}
            actionIndex={[
              {
                activeIndex: 3,
                editIndex: 4,
                delIndex: 5,
              },
            ]}
            handleAction={handleAction}
          />
        </Card>
      </ScrollView>
    </View>
  );
});

export default MatchCheckListOptionScreen;
