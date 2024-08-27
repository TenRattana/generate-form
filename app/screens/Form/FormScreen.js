import { StyleSheet, ScrollView, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "../../../config/axios";
import { Button, Card, Input } from "@rneui/themed";
import { colors, spacing, fonts } from "../../../theme";
import { CustomTable, useResponsive } from "../../components";

const Forms = () => {
  const [form, setForm] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const responsive = useResponsive();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [questionResponse] = await Promise.all([axios.post("GetForms")]);
        setForm(questionResponse.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleAction = async (action, item) => {
    setIsLoading(true);
    //     try {
    //       if (action === "edit") {
    //         const response = await axios.post("GetQuestion", { QuestionID: item });
    //         const questionData = response.data[0] || {};
    //       } else if (action === "del") {
    //         const response1 = await axios.post("DeleteQuestion", {
    //           QuestionID: item,
    //         });
    //         const response2 = await axios.post("GetQuestions");
    //         setQuestion(response2.data || []);
    //       }
    //     } catch (error) {
    //       console.error("Error fetching question data:", error);
    //     }
    //     setIsLoading(false);
  };

  const tableData = form.map((item) => {
    return [
      item.FormName,
      item.MachineName,
      item.IsActive,
      item.Description,
      item.DisplayOrder,
      item.FormID,
      item.FormID,
    ];
  });

  const tableHead = [
    "Form Name",
    "Machine Name",
    "Status",
    "Description",
    "DisplayOrder",
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
    <ScrollView style={styles.scrollView}>
      <Card>
        <Card.Title>List Question</Card.Title>
        <CustomTable
          Tabledata={tableData}
          Tablehead={tableHead}
          editIndex={5}
          //   flexArr={[5, 1, 1]}
          delIndex={6}
          handleAction={handleAction}
        />
      </Card>
    </ScrollView>
  );
};

export default Forms;
