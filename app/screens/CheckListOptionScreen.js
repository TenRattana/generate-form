import React, { useState, useCallback, useMemo } from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import axios from "../../config/axios";
import { Card } from "@rneui/themed";
import { CustomTable, LoadingSpinner, Dialog_clo } from "../components";
import { useTheme, useToast, useRes } from "../../contexts";
import screenStyles from "../../styles/screens/screen";
import { useFocusEffect } from "@react-navigation/native";

const CheckListOptionScreen = React.memo(() => {
  const [checkListOption, setCheckListOption] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [initialValues, setInitialValues] = useState({
    checkListOptionId: "",
    checkListOptionName: "",
  });
  const { colors, fonts, spacing } = useTheme();
  const { Toast } = useToast();
  const { responsive } = useRes();
  const styles = screenStyles({ colors, spacing, fonts, responsive });
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

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const [checkListOptionResponse] = await Promise.all([
            axios.post("CheckListOption_service.asmx/GetCheckListOptions"),
          ]);
          setCheckListOption(checkListOptionResponse.data.data ?? []);
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
          checkListOptionId: "",
          checkListOptionName: "",
        });
        setIsEditing(false);
      };
    }, [])
  );

  const saveData = async (values) => {
    setIsLoadingButton(true);

    const data = {
      CLOptionID: values.checkListOptionId,
      CLOptionName: values.checkListOptionName,
    };

    try {
      await axios.post(
        "CheckListOption_service.asmx/SaveCheckListOption",
        data
      );
      const response = await axios.post(
        "CheckListOption_service.asmx/GetCheckListOptions"
      );
      setCheckListOption(response.data.data ?? []);
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
          "CheckListOption_service.asmx/GetCheckListOption",
          {
            CLOptionID: item,
          }
        );
        const checkListOptionData = response.data.data[0] ?? {};
        setInitialValues({
          checkListOptionId: checkListOptionData.CLOptionID ?? "",
          checkListOptionName: checkListOptionData.CLOptionName ?? "",
        });
        setIsVisible(true);
        setIsEditing(true);
      } else {
        if (action === "activeIndex") {
          await axios.post(
            "CheckListOption_service.asmx/ChangeCheckListOption",
            {
              CLOptionID: item,
            }
          );
        } else if (action === "delIndex") {
          await axios.post(
            "CheckListOption_service.asmx/DeleteCheckListOption",
            {
              CLOptionID: item,
            }
          );
        }

        const response = await axios.post(
          "CheckListOption_service.asmx/GetCheckListOptions"
        );
        setCheckListOption(response.data.data ?? []);
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
        checkListOptionId: "",
        checkListOptionName: "",
      });
      setIsEditing(false);
    }
  }, [isVisible]);

  const tableData = checkListOption.map((item) => {
    return [
      item.CLOptionName,
      item.IsActive,
      item.CLOptionID,
      item.CLOptionID,
      item.CLOptionID,
    ];
  });

  const tableHead = [
    "Check List Option Name",
    "Status",
    "Change Status",
    "Edit",
    "Delete",
  ];

  const actionIndex = [{ activeIndex: 2, editIndex: 3, delIndex: 4 }];

  const customtableProps = {
    Tabledata: tableData,
    Tablehead: tableHead,
    flexArr: [5, 1, 1, 1, 1],
    actionIndex,
    handleAction,
  };

  const dialog_cloProps = {
    style: { styles, colors, spacing, responsive, fonts },
    isVisible,
    isEditing,
    initialValues,
    saveData,
    setIsVisible,
  };

  return (
    <View style={styles.scrollView}>
      <ScrollView>
        <Card>
          <Card.Title>Create Option</Card.Title>
          <Card.Divider />

          <Pressable
            onPress={() => setIsVisible(true)}
            style={[styles.button, styles.backMain]}
          >
            <Text style={[styles.text, styles.textLight]}>
              Create Check List Option
            </Text>
          </Pressable>

          {isLoading ? (
            <CustomTable {...customtableProps} />
          ) : (
            <LoadingSpinner />
          )}
        </Card>
      </ScrollView>

      <Dialog_clo {...dialog_cloProps} />
    </View>
  );
});

export default CheckListOptionScreen;
