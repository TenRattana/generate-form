import { StyleSheet, ScrollView, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "../../../config/axios";
import { Button, Card, Input } from "@rneui/themed";
import { colors, spacing, fonts } from "../../../theme";
import { CustomTable, useResponsive } from "../../components";
import CreateFormScreen from "./CreateFormScreen";

const Forms = ({ navigation }) => {
  const [form, setForm] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const responsive = useResponsive();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [formResponse] = await Promise.all([axios.post("GetForms")]);
        setForm(formResponse.data.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleAction = async (action, item) => {
    setIsLoading(true);
    try {
      if (action === "edit") {
        navigation.navigate("Create Form", { formIdforEdit: item });
      } else if (action === "del") {
        const response1 = await axios.post("Delete", {
          QuestionID: item,
        });
        const response2 = await axios.post("GetQuestions");
        setQuestion(response2.data || []);
      }
    } catch (error) {
      console.error("Error fetching question data:", error);
    }
    setIsLoading(false);
  };

  const tableData = form.map((item) => {
    return [item.FormName, item.FormID, item.FormID, item.FormID];
  });

  const tableHead = ["Form Name", "Copy Template", "Edit", "Delete"];

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
    <ScrollView style={styles.scrollView}>
      <Card>
        <Card.Title>List Question</Card.Title>
        <Card.Divider />
        <CustomTable
          Tabledata={tableData}
          Tablehead={tableHead}
          flexArr={[4, 1, 1, 1]}
          copyIndex={1}
          editIndex={2}
          delIndex={3}
          TextAlie={["left"]}
          handleAction={handleAction}
        />
      </Card>
    </ScrollView>
  );
};

export default Forms;
