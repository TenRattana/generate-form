import React, { useState } from "react";
import { StyleSheet, ScrollView, Text, View, Dimensions } from "react-native";
import { useResponsive, Dialogs } from "../../components";
import { colors, spacing, fonts } from "../../../theme";
import { Button, Divider } from "@rneui/themed";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { Selects, Radios, Checkboxs, Textareas, Inputs } from "../../components";

export default function CreateFormScreen() {
  const responsive = useResponsive();
  const { width, height } = Dimensions.get("window");

  const [formData, setFormData] = useState({
    Contentname: "Content Name",
    Description: "Enter Content Description here.",
  });
  const [DialogField, setDialogField] = useState(false);
  const [fields, setField] = useState([
    {
      CardName: "Personal Information",
      CardColumns: 2,
      DisplayOrder: 1,
      MatchQuestionMachines: [
        {
          MQuestionID: "MQ001",
          MachineID: "M001",
          QuestionName: "What is your name?",
          TypeName: "RADIO",
          DisplayOrder: 1,
          MatchQuestionOptions: [
            {
              MQOptionID: "MQO001",
              OptionID: "O001",
              OptionName: "Option 1",
              Description: "Option 1 for What is your name?",
            },
          ],
        },
        {
          MQuestionID: "MQ003",
          MachineID: "M001",
          QuestionName: "When were you born?",
          TypeName: "CHECKBOX",
          DisplayOrder: 2,
          MatchQuestionOptions: [
            {
              MQOptionID: "MQO001",
              OptionID: "O001",
              OptionName: "Option 1",
              Description: "Option 1 for What is your name?",
            },
          ],
        },
        {
          MQuestionID: "MQ004",
          MachineID: "M001",
          QuestionName: "How old are you?",
          TypeName: "DROPDOWN",
          DisplayOrder: 3,
          MatchQuestionOptions: [
            {
              MQOptionID: "MQO001",
              OptionID: "O001",
              OptionName: "Option 1",
              Description: "Option 1 for What is your name?",
            },
          ],
        },
      ],
    },
  ]);

  const OpenDialog = (DialogFields) => {
    setDialogField(DialogFields);
  };

  const handleChange = (name, value, type) => {
    setFormData({
      ...formData,
      [name]: type === "CHECKBOX" ? value : value,
    });
  };

  const renderField = (field) => {
    switch (field.TypeName) {
      case "DROPDOWN":
        return <Selects field={field} formData={formData} handleChange={handleChange} />;
      case "RADIO":
        return <Radios field={field} formData={formData} handleChange={handleChange} />;
      case "CHECKBOX":
        return <Checkboxs field={field} formData={formData} handleChange={handleChange} />;
      case "TEXTAREA":
        return <Textareas field={field} formData={formData} handleChange={handleChange} />;
      case "FILE":
        return <View style={styles.fileContainer}><Text>File Upload</Text></View>;
      case "TEXTINPUT":
        return <Inputs field={field} formData={formData} handleChange={handleChange} />;
      default:
        return null;
    }
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap"
    },
    toolContainer: {
      width: responsive === "small" ? "100%" : responsive === "medium" ? "40%" : "30%",
      height: height - 100,
      padding: spacing.sm,
      backgroundColor: colors.palette.dark4,
    },
    fieldContainer: {
      width: "100%",
      marginBottom: spacing.xxl,
      borderRadius: spacing.sm,
    },
    textBuildHead: {
      alignSelf: "center",
      marginVertical: spacing.xs,
      color: colors.palette.light,
      fontSize: responsive === "small" ? fonts.md : fonts.xmd,
    },
    textHeadContent: {
      paddingLeft: spacing.sm,
      marginVertical: spacing.xs,
      color: colors.text,
      fontWeight: "bold",
      fontSize: responsive === "small" ? fonts.md : fonts.lg,
    },
    formContainer: {
      width: responsive === "small" ? "100%" : responsive === "medium" ? "60%" : "70%",
      height: height - 100,
      padding: spacing.sm,
      borderWidth: 1,
      borderColor: colors.palette.dark,
      backgroundColor: colors.palette.light,
    },
    containerButtonAdd: {
      marginVertical: spacing.xs,
      justifyContent: "center",
    },
    containerButton: {
      padding: spacing.sm,
      width: "100%",
      backgroundColor: colors.palette.background2,
      borderColor: colors.palette.dark4,
      borderWidth: 1,
      justifyContent: "space-between",
      borderRadius: spacing.sm,
      shadowColor: colors.palette.dark,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    textAdd: {
      fontSize: responsive === "small" ? fonts.sm : fonts.xsm,
      color: colors.palette.blue,
    },
    text: {
      fontSize: responsive === "small" ? fonts.sm : fonts.xsm,
      color: colors.palette.light,
    },
    section: {
      padding: spacing.sm,
      marginBottom: spacing.md,
      borderRadius: spacing.sm,
      backgroundColor: "white",
    },
    sectionTitle: {
      fontSize: fonts.md,
      fontWeight: "bold",
    },
    gridContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    gridItem: {
      padding: spacing.sm,
      borderColor: colors.palette.dark4,
      borderWidth: 1,
      borderRadius: spacing.sm,
      backgroundColor: colors.palette.light,
      margin: spacing.sm,
    },
    fileContainer: {
      padding: spacing.sm,
      borderColor: "gray",
      borderWidth: 1,
      borderRadius: spacing.sm,
      backgroundColor: "white",
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.toolContainer}
        showsVerticalScrollIndicator={true}
        indicatorStyle="black"
      >
        <Text style={styles.textBuildHead}>Build Form</Text>
        <View style={styles.fieldContainer}>
          <Dialogs isVisible={DialogField} onClose={OpenDialog} />
          <Button
            title="Add Field"
            titleStyle={styles.textAdd}
            buttonStyle={[styles.containerButton, styles.containerButtonAdd]}
            icon={<AntDesign name="plus" size={16} color={colors.palette.blue} />}
            onPress={() => OpenDialog(true)}
            iconPosition="left"
          />
        </View>
      </ScrollView>
      <ScrollView
        style={styles.formContainer}
        showsVerticalScrollIndicator={true}
        indicatorStyle="black"
      >
        <Text style={styles.textHeadContent}>{formData.Contentname}</Text>
        <Text style={[styles.text, { color: colors.text, paddingLeft: spacing.sm }]}>
          {formData.Description}
        </Text>
        <Divider />
        {fields.map((item, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{item.CardName}</Text>
            <View style={styles.gridContainer}>
              {item.MatchQuestionMachines.map((field, MQuestionID) => (
                <View
                  key={MQuestionID}
                  style={[
                    styles.gridItem,
                    {
                      flexBasis: `${
                        responsive === "small" ? 90 : 90 / item.CardColumns
                      }%`,
                      flexGrow: field.DisplayOrder,
                    },
                  ]}
                >
                  <Text>{field.QuestionName}</Text>
                  {renderField(field)}
                </View>
              ))}
            </View>
            <Divider />
          </View>
        ))}
        <Button
          title="Add Card"
          titleStyle={styles.textAdd}
          buttonStyle={[styles.containerButton, styles.containerButtonAdd]}
          icon={<AntDesign name="plus" size={16} color={colors.palette.light} />}
          onPress={() => OpenDialog(true)}
          iconPosition="left"
        />
      </ScrollView>
    </View>
  );
}
