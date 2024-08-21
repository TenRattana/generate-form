import { StyleSheet, ScrollView, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "../../config/axios";
import { Button, Card, Input } from "@rneui/themed";
import { colors, spacing, fonts } from "../../theme";
import { CustomTable, useResponsive } from "../components";
import validator from "validator";

const QuestionOptionScreen = () => {
  const [option, setOption] = useState([]);
  const [formState, setFormState] = useState({
    questionOptionId: "",
    questionOptionName: "",
  });
  const [error, setError] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const responsive = useResponsive();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [optionResponse] = await Promise.all([
          axios.post("GetQuestionOptions"),
        ]);
        setOption(optionResponse.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (fieldName, value) => {
    let errorMessage = "";

    if (fieldName === "questionOptionName" && validator.isEmpty(value.trim())) {
      errorMessage = "The Question Option Name field is required.";
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
        if (!isEditing && key === "questionOptionId") {
          return true;
        }
        return value !== "" && value !== "" && String(value).trim() !== "";
      }) && Object.values(error).every((err) => err === "")
    );
  };

  const resetForm = () => {
    setFormState({ questionOptionId: "", questionOptionName: "" });
    setError({});
    setIsEditing(false);
  };

  const saveData = async () => {
    setIsLoading(true);
    const data = {
      OptionID: formState.questionOptionId,
      OptionName: formState.questionOptionName,
    };

    try {
      await axios.post("SaveQuestionOption", data, {
        headers: { "Content-Type": "application/json" },
      });
      setFormState({ questionOptionId: "", questionOptionName: "" });
      setError({});
      const response = await axios.post("GetQuestionOptions");
      setOption(response.data || []);
    } catch (error) {
      console.error("Error inserting data:", error);
    }
    setIsLoading(false);
  };

  const handleAction = async (action, item) => {
    setIsLoading(true);
    try {
      if (action === "edit") {
        const response = await axios.post("GetQuestionOption", {
          OptionID: item,
        });
        const questionoptionData = response.data[0] || {};

        setFormState({
          questionOptionId: questionoptionData.OptionID || "",
          questionOptionName: questionoptionData.OptionName || "",
        });
      } else if (action === "del") {
        const response1 = await axios.post("DeleteQuestionOption", {
          QuestionID: item,
        });
        const response2 = await axios.post("GetQuestionOptions");
        setOption(response2.data || []);
      }
    } catch (error) {
      console.error("Error fetching question option data:", error);
    }
    setIsLoading(false);
  };

  const tableData = option.map((item) => {
    return [item.OptionName, item.OptionID, item.OptionID];
  });

  const tableHead = ["Question Option Name", "Edit", "Delete"];

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
        <Card.Title>Create Option</Card.Title>
        <Card.Divider />

        <Input
          placeholder="Enter Question Option Name"
          label="Question Option Name"
          labelStyle={styles.text}
          inputStyle={styles.text}
          disabledInputStyle={styles.containerInput}
          onChangeText={(text) => handleChange("questionOptionName", text)}
          value={formState.questionOptionName}
        />
        {error.questionOptionName ? (
          <Text style={styles.errorText}>{error.questionOptionName}</Text>
        ) : (
          false
        )}

        <View style={styles.buttonContainer}>
          <Button
            title="Create"
            type="outline"
            titleStyle={styles.text}
            containerStyle={styles.containerButton}
            disabled={!isFormValid()}
            onPress={saveData}
            loading={isLoading}
          />
          <Button
            title="Reset"
            type="outline"
            titleStyle={styles.text}
            containerStyle={styles.containerButton}
            onPress={resetForm}
          />
        </View>
      </Card>

      <Card>
        <Card.Title>List Option</Card.Title>
        <CustomTable
          Tabledata={tableData}
          Tablehead={tableHead}
          flexArr={[5, 1, 1]}
          editIndex={1}
          delIndex={2}
          handleAction={handleAction}
        />
      </Card>
    </ScrollView>
  );
};

export default QuestionOptionScreen;
