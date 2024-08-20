import React from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Table, Row, Rows } from "react-native-table-component";
import AntDesign from "@expo/vector-icons/AntDesign";
import { colors } from "../../theme"; // Assuming colors is defined in your theme

// Sample Data
const data = [
  {
    MQOptionID: "MQO001",
    MatchQuestionOptions: [
      {
        ID: 1,
        MQOptionID: "MQO001",
        QuestionID: "Q001",
        OptionID: "O001",
        DisplayOrder: 1,
        Description: "Option 1 for What is your name?",
      },
      {
        ID: 3,
        MQOptionID: "MQO001",
        QuestionID: "Q002",
        OptionID: "O003",
        DisplayOrder: 2,
        Description: "Option 3 for How old are you?",
      },
    ],
  },
  {
    MQOptionID: "MQO002",
    MatchQuestionOptions: [
      {
        ID: 1,
        MQOptionID: "MQO002",
        QuestionID: "Q001",
        OptionID: "O001",
        DisplayOrder: 1,
        Description: "Option 1 for What is your name?",
      },
      {
        ID: 2,
        MQOptionID: "MQO002",
        QuestionID: "Q001",
        OptionID: "O002",
        DisplayOrder: 2,
        Description: "Option 2 for What is your name?",
      },
    ],
  },
];

// Define headers for the table
const tableHead = [
  "Match Option ID",
  "Question Name",
  "Option Name",
  "Description",
  "DisplayOrder",
  "Edit",
  "Delete",
];

const MyTable = () => {
  // Prepare table data
  const rows = data.flatMap((item) => 
    item.MatchQuestionOptions.map((option, index) => [
      // Display the MQOptionID only once per group
      index === 0 ? item.MQOptionID : "",
      option.QuestionID,
      option.OptionID,
      option.Description,
      option.DisplayOrder,
      // Add placeholders for Edit and Delete buttons
      <TouchableOpacity key={`edit-${option.ID}`} style={styles.button}>
        <AntDesign name="edit" size={20} color={colors.primary} />
      </TouchableOpacity>,
      <TouchableOpacity key={`delete-${option.ID}`} style={styles.button}>
        <AntDesign name="delete" size={20} color={colors.danger} />
      </TouchableOpacity>,
    ])
  );

  return (
    <ScrollView style={styles.container}>
      <Table borderStyle={styles.border}>
        <Row data={tableHead} style={styles.header} textStyle={styles.text} />
        <Rows data={rows} textStyle={styles.text} style={({ index }) => index % 2 === 0 ? styles.evenRow : styles.oddRow} />
      </Table>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    height: 50,
    backgroundColor: "#f1f8ff",
  },
  border: {
    borderWidth: 1,
    borderColor: "#c8e1ff",
  },
  text: {
    margin: 6,
    textAlign: "center",
  },
  button: {
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  evenRow: {
    backgroundColor: "#f9f9f9",
  },
  oddRow: {
    backgroundColor: "#ffffff",
  },
});

export default MyTable;
