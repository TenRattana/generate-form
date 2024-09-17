import React, { useState, useCallback, useMemo } from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import axios from "../../config/axios";
import { Card } from "@rneui/themed";
import { CustomTable, LoadingSpinner, Dialog_cl } from "../components";
import { useTheme, useToast, useRes } from "../../contexts";
import screenStyles from "../../styles/screens/screen";
import { useFocusEffect } from "@react-navigation/native";

const CheckListScreen = React.memo(() => {
  const [checkList, setCheckList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [initialValues, setInitialValues] = useState({
    checkListId: "",
    checkListName: "",
  });

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
          checkListId: "",
          checkListName: "",
        });
        setIsEditing(false);
      };
    }, [])
  );

  const saveData = async (values) => {
    setIsLoadingButton(true);

    const data = {
      CListId: values.checkListId,
      CListName: values.checkListName,
    };

    try {
      await axios.post("CheckList_service.asmx/SaveCheckList", data);
      const response = await axios.post("CheckList_service.asmx/GetCheckLists");
      setCheckList(response.data.data ?? []);
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
          "CheckList_service.asmx/GetCheckList",
          {
            CListID: item,
          }
        );
        const checkListData = response.data.data[0] ?? {};
        setInitialValues({
          checkListId: checkListData.CListID ?? "",
          checkListName: checkListData.CListName ?? "",
        });
        setIsVisible(true);
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
        error.response ? error.response.data.errors : ["Something went wrong!"],
        "error"
      );
    }
  };

  useMemo(() => {
    if (!isVisible) {
      setInitialValues({
        checkListId: "",
        checkListName: "",
      });
      setIsEditing(false);
    }
  }, [isVisible]);

  const tableData = checkList.map((item) => {
    return [
      item.CListName,
      item.IsActive,
      item.CListID,
      item.CListID,
      item.CListID,
    ];
  });

  const tableHead = [
    "Check List Name",
    "Status",
    "Change Status",
    "Edit",
    "Delete",
  ];

  const actionIndex = [
    {
      activeIndex: 2,
      editIndex: 3,
      delIndex: 4,
    },
  ];

  const customtableProps = {
    Tabledata: tableData,
    Tablehead: tableHead,
    flexArr: [5, 1, 1, 1, 1],
    actionIndex,
    handleAction,
  };

  const dialog_clProps = {
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
          <Card.Title>List Check List</Card.Title>
          <Card.Divider />

          <Pressable
            onPress={() => setIsVisible(true)}
            style={[styles.button, styles.backMain]}
          >
            <Text style={[styles.text, styles.textLight]}>
              Create Check List
            </Text>
          </Pressable>

          {isLoading ? (
            <CustomTable {...customtableProps} />
          ) : (
            <LoadingSpinner />
          )}
        </Card>
      </ScrollView>

      <Dialog_cl {...dialog_clProps} />
    </View>
  );
});

export default CheckListScreen;
