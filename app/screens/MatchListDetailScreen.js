import { StyleSheet, ScrollView, Text, View } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import axios from "../../config/axios";
import { Button, Card, Input } from "@rneui/themed";
import { colors, spacing, fonts } from "../../theme";
import {
  CustomTable,
  CustomDropdown,
  CustomDropdownMulti,
  useResponsive,
} from "../components";
import validator from "validator";
import { ToastContext } from "../contexts";

const MatchListDetailScreen = () => {
  const [matchListDetail, setMachineListDetail] = useState([]);
  const [list, setList] = useState([]);
  const [listDetail, setListDetail] = useState([]);
  const [formState, setFormState] = useState({
    Id: "",
    listId: "",
    listDetailId: [],
    description: "",
  });
  const [matchListDetailId, setMatchListDetailId] = useState("");
  const [error, setError] = useState({});
  const [resetDropdown, setResetDropdown] = useState(false);
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

  console.log("MatchListDetailScreen");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listResponse, listDetailResponse, matchListDetailResponse] =
          await Promise.all([
            axios.post("GetLists"),
            axios.post("GetListDetails"),
            axios.post("GetMatchListDetails"),
          ]);
        setList(listResponse.data.data || []);
        setListDetail(listDetailResponse.data.data || []);
        setMachineListDetail(matchListDetailResponse.data.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (fieldName, value) => {
    let errorMessage = "";

    if (fieldName === "description" && validator.isEmpty(value.trim())) {
      errorMessage = "The Description field is required.";
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
        if (!isEditing && key === "Id") {
          return true;
        }
        if (key === "listDetailId")
          return Array.isArray(value) && value.length > 0;
        return (
          value !== null && value !== undefined && String(value).trim() !== ""
        );
      }) && Object.values(error).every((err) => err === "")
    );
  };

  const resetForm = () => {
    setFormState({
      Id: "",
      listId: "",
      listDetailId: [],
      description: "",
    });

    setMatchListDetailId("");
    setError({});
    setIsEditing(false);
  };

  const saveData = async () => {
    setIsLoading(true);

    const data = {
      MLDetailID: matchListDetailId,
      ListID: formState.listId,
      LDetailID: JSON.stringify(formState.listDetailId),
      Description: formState.description,
    };

    try {
      const responseData = await axios.post("SaveMatchListDetail", data);

      const response = await axios.post("GetMatchListDetails");
      setMachineListDetail(response.data.data || []);
      setResetDropdown(true);
      setTimeout(() => setResetDropdown(false), 0);
      resetForm();
    } catch (error) {
      console.error("Error inserting data:", error);
    }
    setIsLoading(false);
  };

  const handleAction = async (action, item) => {
    setIsLoading(true);

    try {
      if (action === "editIndex") {
        const response = await axios.post("GetMatchListDetail", {
          MLDetailID: item,
        });
        const matchListDetailData = response.data.data[0] || [];

        setMatchListDetailId(matchListDetailData.MLDetailID || "");

        setFormState({
          Id: matchListDetailData.ID || "",
          listId: matchListDetailData.ListID || "",
          listDetailId:
            matchListDetailData.MatchListDetail.map(
              (option) => option.LDetailID
            ) || [],
          description: matchListDetailData.Description || "",
        });
      } else if (action === "delIndex") {
        await axios.post("DeleteMatchListDetail", {
          ID: item,
        });
        const response = await axios.post("GetMatchListDetails");
        setMachineListDetail(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching machine data:", error);
    }
    setIsLoading(false);
  };

  const tableData = matchListDetail.flatMap((item, idx) => {
    const listName = list.find(
      (group) => group.ListID === item.ListID
    )?.ListName;

    if (item.MatchListDetail.length > 0) {
      return item.MatchListDetail.map((mld, index) => {
        const detailName = listDetail.find(
          (group) => group.LDetailID === mld.LDetailID
        )?.LDetailName;

        return [
          `Group ${idx + 1}`,
          listName ? listName : "",
          detailName ? detailName : "",
          mld.Description,
          item.MLDetailID,
          mld.ID,
        ];
      });
    }
    return [];
  });

  const tableHead = [
    "Group Name",
    "List Name",
    "List Detail Name",
    "Description",
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
        <Card.Title>Create List Detail</Card.Title>
        <Card.Divider />

        <CustomDropdown
          fieldName="listId"
          title="List"
          labels="ListName"
          values="ListID"
          data={list}
          updatedropdown={handleChange}
          reset={resetDropdown}
          selectedValue={formState.listId}
        />
        {error.listId ? (
          <Text style={styles.errorText}>{error.listId}</Text>
        ) : null}

        <CustomDropdownMulti
          fieldName="listDetailId"
          title="List Detail"
          labels="LDetailName"
          values="LDetailID"
          data={listDetail}
          updatedropdown={handleChange}
          reset={resetDropdown}
          selectedValue={formState.listDetailId}
        />
        {error.listDetailId ? (
          <Text style={styles.errorText}>{error.listDetailId}</Text>
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

        <View style={styles.buttonContainer}>
          <Button
            title="Create"
            type="outline"
            titleStyle={styles.text}
            containerStyle={styles.containerButton}
            disabled={!isFormValid()}
            onPress={() => saveData}
            loading={isLoading}
          />
          <Button
            title="Reset"
            type="outline"
            titleStyle={styles.text}
            containerStyle={styles.containerButton}
            onPress={() => resetForm}
          />
        </View>
      </Card>

      <Card>
        <Card.Title>List Option</Card.Title>
        <Card.Divider />
        <CustomTable
          Tabledata={tableData}
          Tablehead={tableHead}
          flexArr={[1, 3, 3, 5, 1, 1]}
          actionIndex={[{ editIndex: 4, delIndex: 5 }]}
          handleAction={handleAction}
        />
      </Card>
    </ScrollView>
  );
};

export default MatchListDetailScreen;
