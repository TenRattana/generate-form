import { StyleSheet, SafeAreaView, ScrollView, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "../../config/axios";
import { Button, Card, Input } from "@rneui/themed";
import { colors, spacing } from "../../theme";
import {
  CustomTable,
  CustomDropdown,
  CustomDropdownMulti,
} from "../components";
import validator from "validator";

const QuestionDetailScreen = () => {
  const [detailQuestion, setDetailQuestion] = useState([]);
  const [question, setQuestion] = useState([]);
  const [option, setOption] = useState([]);
  const [formState, setFormState] = useState({
    mqotionId: "",
    moptionId: "",
    questionId: "",
    optionId: [],
    displayOrder: "",
    description: "",
  });
  const [error, setError] = useState({});
  const [resetDropdown, setResetDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [questionResponse, optionResponse, questionDetailResponse] =
          await Promise.all([
            axios.post("GetQuestions"),
            axios.post("GetQuestionOptions"),
            axios.post("GetQuestionDetails"),
          ]);
        setQuestion(questionResponse.data || []);
        setOption(optionResponse.data || []);
        setDetailQuestion(questionDetailResponse.data || []);
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
    } else if (
      fieldName === "displayOrder" &&
      validator.isEmpty(value.trim())
    ) {
      errorMessage = "The Display Order field is required.";
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
        if (!isEditing && key === "mqotionId") {
          return true;
        }
        return value !== "" && value !== "" && String(value).trim() !== "";
      }) && Object.values(error).every((err) => err === "")
    );
  };

  const resetForm = () => {
    setFormState({
      mqotionId: "",
      moptionId: "",
      questionId: "",
      optionId: "",
      displayOrder: "",
      description: "",
    });
    setError({});
    setIsEditing(false);
  };

  const saveData = async () => {
    setIsLoading(true);
    const data = {
      MQOtionID: formState.mqotionId,
      MOptionID: formState.moptionId,
      QuestionID: formState.questionId,
      OptionID: formState.optionId,
      Description: formState.displayOrder,
      DisplayOrder: formState.description,
    };

    try {
      await axios.post("SaveQuestionDetail", data, {
        headers: { "Content-Type": "application/json" },
      });
      setFormState({
        mqotionId: "",
        moptionId: "",
        questionId: "",
        optionId: "",
        displayOrder: "",
        description: "",
      });
      setError({});
      const response = await axios.post("GetQuestionDetails");
      setDetailQuestion(response.data || []);
      setResetDropdown(true);
      setTimeout(() => setResetDropdown(false), 0);
    } catch (error) {
      console.error("Error inserting data:", error);
    }
    setIsLoading(false);
  };

  const handleAction = async (action, item) => {
    setIsLoading(true);
    try {
      if (action === "edit") {
        const response = await axios.post("GetQuestionDetail", {
          MQOtionID: item,
        });
        const questionDetailData = response.data[0] || {};

        setFormState({
          mqotionId: questionDetailData.ID,
          moptionId: questionDetailData.MOptionID,
          questionId: questionDetailData.QuestionID,
          optionId: questionDetailData.OptionID,
          displayOrder: String(questionDetailData.DisplayOrder),
          description: questionDetailData.Description,
        });
      } else if (action === "del") {
        const response1 = await axios.post("DeleteQuestionDetail", {
          MachineID: item,
        });
        const response2 = await axios.post("GetQuestionDetails");
        setDetailQuestion(response2.data || []);
      }
    } catch (error) {
      console.error("Error fetching machine data:", error);
    }
    setIsLoading(false);
  };

  const tableData = detailQuestion.map((item) => {
    const q = question.find((group) => group.QuestionID === item.QuestionID);
    const o = option.find((group) => group.OptionID === item.OptionID);

    return [
      item.MQOptionID,
      q ? q.QuestionName : "",
      o ? o.OptionName : "",
      item.Description,
      item.DisplayOrder,
      item.ID,
      item.ID,
    ];
  });

  const tableHead = [
    "Match Option ID",
    "Question Name",
    "Option Name",
    "Description",
    "DisplayOrder",
    "Edit",
    "Delete",
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card>
          <Card.Title>Create Question Detail</Card.Title>
          <Card.Divider />

          <CustomDropdown
            fieldName="questionId"
            title="Question"
            label="Question"
            data={question}
            updatedropdown={handleChange}
            reset={resetDropdown}
            selectedValue={formState.questionId}
          />
          {error.questionId ? (
            <Text style={styles.errorText}>{error.questionId}</Text>
          ) : ""}

          <CustomDropdownMulti
            fieldName="optionId"
            title="Option"
            label="Option"
            data={option}
            updatedropdown={handleChange}
            reset={resetDropdown}
            selectedValue={formState.optionId}
          />
          {error.optionId ? (
            <Text style={styles.errorText}>{error.optionId}</Text>
          ) : ""}

          <Input
            placeholder="Enter Description"
            label="Description"
            disabledInputStyle={styles.containerInput}
            onChangeText={(text) => handleChange("description", text)}
            value={formState.description}
          />
          {error.description ? (
            <Text style={styles.errorText}>{error.description}</Text>
          ) : ""}

          <Input
            placeholder="Enter Display Order"
            label="Display Order"
            disabledInputStyle={styles.containerInput}
            onChangeText={(text) => handleChange("displayOrder", text)}
            value={formState.displayOrder}
          />
          {error.displayOrder ? (
            <Text style={styles.errorText}>{error.displayOrder}</Text>
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
            editIndex={5}
            delIndex={6}
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

export default QuestionDetailScreen;
