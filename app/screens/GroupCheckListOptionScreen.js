import React, { useState, useCallback, useMemo } from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import axios from "../../config/axios";
import { Card } from "@rneui/themed";
import { CustomTable, LoadingSpinner, Dialog_gclo } from "../components";
import { useTheme, useToast, useRes } from "../contexts";
import screenStyles from "../styles/screens/screen";
import { useFocusEffect } from "@react-navigation/native";

const GroupCheckListOptionScreen = React.memo(() => {
  const [groupCheckListOption, setGroupCheckListOption] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [initialValues, setInitialValues] = useState({
    groupCheckListOptionId: "",
    groupCheckListOptionName: "",
    description: "",
    displayOrder: "",
  });
  const { colors, fonts, spacing } = useTheme();
  const { Toast } = useToast();
  const { responsive } = useRes();
  const styles = screenStyles({ colors, spacing, fonts, responsive });
  console.log("GroupCheckListOptionScreen");

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
          groupCheckListOptionId: "",
          groupCheckListOptionName: "",
          description: "",
          displayOrder: "",
        });
        setIsEditing(false);
      };
    }, [])
  );

  const saveData = async (values) => {
    setIsLoadingButton(true);

    const data = {
      GCLOptionID: values.groupCheckListOptionId,
      GCLOptionName: values.groupCheckListOptionName,
      Description: values.description,
      DisplayOrder: values.displayOrder,
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
      setIsVisible(!response.data.status);
    } catch (error) {
      ShowMessages(
        error.message || "Error",
        error.response ? error.response.data.errors : ["Something went wrong!"],
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
          "GroupCheckListOption_service.asmx/GetGroupCheckListOption",
          {
            GCLOptionID: item,
          }
        );
        const groupCheckListOptionData = response.data.data[0] ?? {};
        setInitialValues({
          groupCheckListOptionId: groupCheckListOptionData.GCLOptionID ?? "",
          groupCheckListOptionName:
            groupCheckListOptionData.GCLOptionName ?? "",
          description: groupCheckListOptionData.Description ?? "",
          displayOrder: groupCheckListOptionData.DisplayOrder ?? "",
        });
        setIsVisible(true);
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
        error.response ? error.response.data.errors : ["Something went wrong!"],
        "error"
      );
    }
  };

  useMemo(() => {
    if (!isVisible) {
      setInitialValues({
        groupCheckListOptionId: "",
        groupCheckListOptionName: "",
        description: "",
        displayOrder: "",
      });
      setIsEditing(false);
    }
  }, [isVisible]);

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

          <Pressable
            onPress={() => setIsVisible(true)}
            style={[styles.button, styles.backMain]}
          >
            <Text style={[styles.text, styles.textLight]}>
              Create Group Option
            </Text>
          </Pressable>

          {isLoading ? (
            <CustomTable
              Tabledata={tableData}
              Tablehead={tableHead}
              flexArr={[3, 5, 1, 1, 1, 1, 1]}
              actionIndex={[{ activeIndex: 4, editIndex: 5, delIndex: 6 }]}
              handleAction={handleAction}
            />
          ) : (
            <LoadingSpinner />
          )}
        </Card>
      </ScrollView>

      <Dialog_gclo
        style={{ styles, colors, spacing, responsive, fonts }}
        isVisible={isVisible}
        isEditing={isEditing}
        initialValues={initialValues}
        saveData={saveData}
        setIsVisible={setIsVisible}
      />
    </View>
  );
});

export default GroupCheckListOptionScreen;
