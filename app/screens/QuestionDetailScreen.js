import { StyleSheet, ScrollView, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
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

const QuestionDetailScreen = () => {
  const [detailQuestion, setDetailQuestion] = useState([]);
  const [question, setQuestion] = useState([]);
  const [option, setOption] = useState([]);
  const [formState, setFormState] = useState({
    Id: "",
    questionId: "",
    optionId: [],
    description: "",
  });
  const [moptionId, setMoptionId] = useState("");
  const [error, setError] = useState({});
  const [resetDropdown, setResetDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const responsive = useResponsive();

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
        if (key === "optionId") return value.length > 0;
        else return value !== "" && String(value).trim() !== "";
      }) && Object.values(error).every((err) => err === "")
    );
  };

  const resetForm = () => {
    setFormState({
      Id: "",
      questionId: "",
      optionId: [],
      description: "",
    });
    setError({});
    setIsEditing(false);
  };

  const saveData = async () => {
    setIsLoading(true);
    console.log(formState, moptionId);
    const data = {
      MQOptionID: moptionId,
      QuestionID: formState.questionId,
      OptionID: formState.optionId,
      Description: formState.description,
    };

    try {
      await axios.post("SaveQuestionDetail", data, {
        headers: { "Content-Type": "application/json" },
      });
      setFormState({
        Id: "",
        questionId: "",
        optionId: "",
        description: "",
      });
      setMoptionId("");
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
          MQOptionID: item,
        });
        const questionDetailData = response.data[0] || [];

        setMoptionId(questionDetailData.MQOptionID || "");
        setFormState({
          Id: questionDetailData.ID || "",
          questionId: questionDetailData.QuestionID || "",
          optionId:
            questionDetailData.MatchQuestionOptions.map(
              (option) => option.OptionID
            ) || [],
          description: questionDetailData.Description || "",
        });
      } else if (action === "del") {
        await axios.post("DeleteQuestionDetail", {
          MachineID: item,
        });
        const response = await axios.post("GetQuestionDetails");
        setDetailQuestion(response.data || []);
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
      item.MQOptionID,
      item.ID,
    ];
  });

  const tableHead = [
    "Group ID",
    "Question Name",
    "Option Name",
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
        ) : (
          false
        )}

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
        ) : (
          false
        )}

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
          flexArr={[1, 3, 3, 5, 1, 1]}
          editIndex={4}
          delIndex={5}
          handleAction={handleAction}
        />
      </Card>
    </ScrollView>
  );
};

export default QuestionDetailScreen;
