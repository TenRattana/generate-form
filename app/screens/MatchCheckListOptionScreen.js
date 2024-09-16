import React, { useState, useCallback, useMemo } from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import axios from "../../config/axios";
import { Card } from "@rneui/themed";
import { CustomTable, LoadingSpinner, Dialog_mclo } from "../components";
import validator from "validator";
import { useTheme, useToast, useRes } from "../contexts";
import screenStyles from "../styles/screens/screen";
import { useFocusEffect } from "@react-navigation/native";

const MatchCheckListOptionScreen = React.memo(({ navigation }) => {
  const [checkListOption, setCheckListOption] = useState([]);
  const [groupCheckListOption, setGroupCheckListOption] = useState([]);
  const [matchCheckListOption, setMatchCheckListOption] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [resetDropdown, setResetDropdown] = useState(false);
  const [initialValues, setInitialValues] = useState({
    matchCheckListOptionId: "",
    checkListOptionId: [],
    groupCheckListOptionId: "",
  });
  const { colors, fonts, spacing } = useTheme();
  const { Toast } = useToast();
  const { responsive } = useRes();
  const styles = screenStyles({ colors, spacing, fonts, responsive });
  console.log("MatchCheckListOptionScreen");

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
          setIsLoading(true);
        } catch (error) {
          ShowMessages(
            error.message || "Error",
            error.response
              ? error.response.data.errors
              : ["Something went wrong!"],
            "error"
          );
        }
      };

      fetchData();
      return () => {
        setInitialValues({
          matchCheckListOptionId: "",
          checkListOptionId: [],
          groupCheckListOptionId: "",
        });
        setIsEditing(false);
      };
    }, [])
  );

  const saveData = async (values) => {
    setIsLoadingButton(true);

    const data = {
      MCLOptionID: values.matchCheckListOptionId,
      GCLOptionID: values.groupCheckListOptionId,
      CLOptionID: JSON.stringify(values.checkListOptionId),
    };

    try {
      await axios.post(
        "MatchCheckListOption_service.asmx/SaveMatchCheckListOption",
        data
      );
      const response = await axios.post(
        "MatchCheckListOption_service.asmx/GetMatchCheckListOptions"
      );
      setMatchCheckListOption(response.data.data ?? []);
      setIsVisible(!response.data.status);
    } catch (error) {
      ShowMessages(
        error.message || "Error",
        error.response ? error.response.data.errors : ["Something wrong!"],
        "error"
      );
    } finally {
      setIsLoadingButton(false);
    }
  };

  const handleAction = async (action, item) => {
    try {
      if (action === "editIndex") {
        const response = await axios.post(
          "MatchCheckListOption_service.asmx/GetMatchCheckListOption",
          {
            MCLOptionID: item,
          }
        );
        const matchCheckListOption = response.data.data[0] ?? {};

        let option = [];
        if (matchCheckListOption && matchCheckListOption.CheckListOptions) {
          option = matchCheckListOption.CheckListOptions.map(
            (v) => v.CLOptionID
          );
        }
        setInitialValues({
          matchCheckListOptionId: matchCheckListOption.MCLOptionID ?? "",
          groupCheckListOptionId: matchCheckListOption.GCLOptionID ?? "",
          checkListOptionId: option,
        });

        setIsVisible(true);
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
      ShowMessages(
        error.message || "Error",
        error.response ? error.response.data.errors : ["Something went wrong!"],
        "error"
      );
    }
  };

  useMemo(() => {
    if (!isVisible) {
      setInitialValues({
        matchCheckListOptionId: "",
        checkListOptionId: [],
        groupCheckListOptionId: "",
      });
      setIsEditing(false);
      setResetDropdown(true);
      setTimeout(() => setResetDropdown(false), 0);
    }
  }, [isVisible]);

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

          <Pressable
            onPress={() => setIsVisible(true)}
            style={[styles.button, styles.backMain]}
          >
            <Text style={[styles.text, styles.textLight]}>
              Create Match Group & Option
            </Text>
          </Pressable>

          {isLoading ? (
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
          ) : (
            <LoadingSpinner />
          )}
        </Card>
      </ScrollView>

      <Dialog_mclo
        dropgroupCheckListOption={dropgroupCheckListOption}
        dropcheckListOption={dropcheckListOption}
        style={{ styles, colors, spacing, responsive, fonts }}
        isVisible={isVisible}
        isEditing={isEditing}
        initialValues={initialValues}
        saveData={saveData}
        setIsVisible={setIsVisible}
        resetDropdown={resetDropdown}
      />
    </View>
  );
});

export default MatchCheckListOptionScreen;
