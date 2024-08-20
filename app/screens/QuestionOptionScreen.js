import { StyleSheet, SafeAreaView, ScrollView, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "../../config/axios";
import { Button, Card, Input } from "@rneui/themed";
import { colors, spacing } from "../../theme";
import { CustomTable } from "../components";
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card>
          <Card.Title>Create Option</Card.Title>
          <Card.Divider />

          <Input
            placeholder="Enter Question Option Name"
            label="Question Option Name"
            disabledInputStyle={styles.containerInput}
            onChangeText={(text) => handleChange("questionOptionName", text)}
            value={formState.questionOptionName}
          />
          {error.questionOptionName ? (
            <Text style={styles.errorText}>{error.questionOptionName}</Text>
          ) : ""}

          <View style={styles.buttonContainer}>
            <Button
              title="Create"
              type="outline"
              containerStyle={styles.containerButton}
              disabled={!isFormValid()}
              onPress={saveData}
              loading={isLoading}
            />
            <Button
              title="Reset"
              type="outline"
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
            editIndex={1}
            delIndex={2}
            handleAction={handleAction}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  containerButton: {
    width: 200,
    marginVertical: 10,
    marginHorizontal: 50,
    alignSelf: "center",
  },
  containerInput: {
    backgroundColor: colors.dark,
  },
  errorText: {
    top: -12,
    marginLeft: spacing.sm,
    color: colors.error,
  },
});

export default QuestionOptionScreen;
