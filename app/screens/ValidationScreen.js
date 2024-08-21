import { StyleSheet, ScrollView, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "../../config/axios";
import { Button, Card, Input } from "@rneui/themed";
import { colors, spacing, fonts } from "../../theme";
import { CustomTable, useResponsive } from "../components";
import validator from "validator";

const ValidationScreen = () => {
  const [validation, setValidation] = useState([]);
  const [formState, setFormState] = useState({
    ruleId: "",
    ruleName: "",
  });
  const [error, setError] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const responsive = useResponsive();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [validationResponse] = await Promise.all([
          axios.post("GetValidationRules"),
        ]);
        setValidation(validationResponse.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (fieldName, value) => {
    let errorMessage = "";

    if (fieldName === "ruleName" && validator.isEmpty(value.trim())) {
      errorMessage = "The Rule Name field is required.";
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
        if (!isEditing && key === "ruleId") {
          return true;
        }
        return value !== "" && value !== "" && String(value).trim() !== "";
      }) && Object.values(error).every((err) => err === "")
    );
  };

  const resetForm = () => {
    setFormState({ ruleId: "", ruleName: "" });
    setError({});
    setIsEditing(false);
  };

  const saveData = async () => {
    setIsLoading(true);
    const data = {
      RuleID: formState.ruleId,
      RuleName: formState.ruleName,
    };

    try {
      await axios.post("SaveValidation", data, {
        headers: { "Content-Type": "application/json" },
      });
      setFormState({ ruleId: "", ruleName: "" });
      setError({});
      const response = await axios.post("GetValidationRules");
      setValidation(response.data || []);
    } catch (error) {
      console.error("Error inserting data:", error);
    }
    setIsLoading(false);
  };

  const handleAction = async (action, item) => {
    setIsLoading(true);
    try {
      if (action === "edit") {
        const response = await axios.post("GetValidationRule", {
          RuleID: item,
        });
        const validationData = response.data[0] || {};

        setFormState({
          ruleId: validationData.RuleID || "",
          ruleName: validationData.RuleName || "",
        });
      } else if (action === "del") {
        const response1 = await axios.post("DeleteValidation", {
          RuleID: item,
        });
        const response2 = await axios.post("GetValidationRules");
        setValidation(response2.data || []);
      }
    } catch (error) {
      console.error("Error fetching machine data:", error);
    }
    setIsLoading(false);
  };

  const tableData = validation.map((item) => {
    return [item.RuleName, item.RuleID, item.RuleID];
  });

  const tableHead = ["Rule Name", "Edit", "Delete"];

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
        <Card.Title>Create Rule</Card.Title>
        <Card.Divider />

        <Input
          placeholder="Enter Rule Name"
          label="Rule Name"
          disabledInputStyle={styles.containerInput}
          onChangeText={(text) => handleChange("ruleName", text)}
          value={formState.ruleName}
        />
        {error.ruleName ? (
          <Text style={styles.errorText}>{error.ruleName}</Text>
        ) : (
          ""
        )}

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
          flexArr={[5, 1, 1]}
          editIndex={1}
          delIndex={2}
          handleAction={handleAction}
        />
      </Card>
    </ScrollView>
  );
};

export default ValidationScreen;
