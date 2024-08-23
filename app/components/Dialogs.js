import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Dialog, Input } from "@rneui/themed";
import { colors, spacing, fonts } from "../../theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { CustomDropdown } from "./";
import axios from "../../config/axios";

const Dialogs = ({
  isVisible,
  target,
  currentField,
  onClose,
  data,
  onDone,
  onDonestype,
}) => {
  const [show, setShow] = useState(isVisible);
  const [currentPage, setCurrentPage] = useState(target || "menu");
  const [form, setForm] = useState(data);
  const [formState, setFormState] = useState({});
  const [formCard, setFormCard] = useState({});
  const [questions, setQuestions] = useState([]);
  const [resetDropdown, setResetDropdown] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("GetQuestionDetails");
        setQuestions(response.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setShow(isVisible);
    setForm(data);
    setCurrentPage(target || "menu");
    setFormCard(currentField || {});
  }, [isVisible, data, target, currentField]);

  const handleClose = () => {
    onClose();
    setCurrentPage("menu");
  };

  const handleDone = () => {
    if (currentPage === "menu") return;
    if (currentPage === "Card") {
      onDonestype(formCard);
      setFormCard({});
    } else {
      onDone(formState);
      setFormState({});
    }
    handleClose();
  };

  const handleChange = (key, value, type, menu) => {
    if (menu === "card") {
      setFormCard((prevState) => ({
        ...prevState,
        [key]: value,
      }));
    } else {
      setFormState((prevState) => ({
        ...prevState,
        [key]: value,
        TypeName: type.toUpperCase(),
        MQuestionID: value,
      }));
    }
  };

  const renderContent = () => {
    const commonInputs = (
      <>
        <Input
          placeholder="Enter DisplayOrder"
          label="DisplayOrder"
          labelStyle={styles.text}
          inputStyle={styles.text}
          disabledInputStyle={styles.containerInput}
          onChangeText={(text) =>
            handleChange("DisplayOrder", text, currentPage)
          }
        />
        <Dialog.Button
          buttonStyle={styles.button}
          title={<Text style={styles.buttonText}>Done</Text>}
          onPress={handleDone}
        />
      </>
    );

    switch (currentPage) {
      case "Header":
        return (
          <View>
            <Input
              placeholder="Enter Form Name"
              label="Form Name"
              labelStyle={styles.text}
              inputStyle={styles.text}
              disabledInputStyle={styles.containerInput}
              onChangeText={(text) => handleChange("FormName", text)}
            />
            <Input
              placeholder="Enter Form Description"
              label="Form Description"
              labelStyle={styles.text}
              inputStyle={styles.text}
              disabledInputStyle={styles.containerInput}
              onChangeText={(text) => handleChange("FormDescription", text)}
            />
            <Dialog.Button
              buttonStyle={styles.button}
              title={<Text style={styles.buttonText}>Done</Text>}
              onPress={handleDone}
            />
          </View>
        );
      case "Card":
        return (
          <View>
            <Input
              placeholder="Enter Card Name"
              label="Card Name"
              labelStyle={styles.text}
              inputStyle={styles.text}
              disabledInputStyle={styles.containerInput}
              onChangeText={(text) =>
                handleChange("CardName", text, null, "card")
              }
              value={formCard.CardName || ""}
            />
            <Input
              placeholder="Enter Card Columns"
              label="Card Columns"
              labelStyle={styles.text}
              inputStyle={styles.text}
              disabledInputStyle={styles.containerInput}
              onChangeText={(text) =>
                handleChange("CardColumns", text, null, "card")
              }
              value={formCard.CardColumns || ""}
            />
            <Dialog.Button
              buttonStyle={styles.button}
              title={<Text style={styles.buttonText}>Done</Text>}
              onPress={handleDone}
            />
          </View>
        );
      case "Textinput":
      case "Dropdown":
      case "Radio":
      case "Checkbox":
      case "Textarea":
      case "File":
        return (
          <View>
            <CustomDropdown
              fieldName="MQOptionID"
              title="Question"
              labels="QuestionName"
              values="MQOptionID"
              data={questions}
              updatedropdown={(fieldName, value) =>
                handleChange(fieldName, value, currentPage.toUpperCase())
              }
              reset={resetDropdown}
              selectedValue={formState.questionId}
            />
            {commonInputs}
          </View>
        );
      default:
        return (
          <View style={styles.menuContainer}>
            <Dialog.Button
              buttonStyle={styles.button}
              icon={
                <MaterialCommunityIcons
                  name="cards-variant"
                  size={20}
                  color={colors.palette.light}
                />
              }
              iconPosition="top"
              title={<Text style={styles.buttonText}>Card</Text>}
              onPress={() => setCurrentPage("Card")}
            />
            <Dialog.Button
              buttonStyle={styles.button}
              icon={
                <FontAwesome5
                  name="text-width"
                  size={20}
                  color={colors.palette.light}
                />
              }
              iconPosition="top"
              title={<Text style={styles.buttonText}>Text Input</Text>}
              onPress={() => setCurrentPage("Textinput")}
            />
            <Dialog.Button
              buttonStyle={styles.button}
              icon={
                <Feather name="list" size={20} color={colors.palette.light} />
              }
              iconPosition="top"
              title={<Text style={styles.buttonText}>Dropdown</Text>}
              onPress={() => setCurrentPage("Dropdown")}
            />
            <Dialog.Button
              buttonStyle={styles.button}
              icon={
                <Ionicons
                  name="radio-button-on"
                  size={20}
                  color={colors.palette.light}
                />
              }
              iconPosition="top"
              title={<Text style={styles.buttonText}>Radio</Text>}
              onPress={() => setCurrentPage("Radio")}
            />
            <Dialog.Button
              buttonStyle={styles.button}
              icon={
                <FontAwesome5
                  name="text-width"
                  size={20}
                  color={colors.palette.light}
                />
              }
              iconPosition="top"
              title={<Text style={styles.buttonText}>Textarea</Text>}
              onPress={() => setCurrentPage("Textarea")}
            />
            <Dialog.Button
              buttonStyle={styles.button}
              icon={
                <AntDesign
                  name="checksquare"
                  size={20}
                  color={colors.palette.light}
                />
              }
              iconPosition="top"
              title={<Text style={styles.buttonText}>Checkbox</Text>}
              onPress={() => setCurrentPage("Checkbox")}
            />
            <Dialog.Button
              buttonStyle={styles.button}
              icon={
                <AntDesign
                  name="addfile"
                  size={20}
                  color={colors.palette.light}
                />
              }
              iconPosition="top"
              title={<Text style={styles.buttonText}>File</Text>}
              onPress={() => setCurrentPage("File")}
            />
          </View>
        );
    }
  };

  return (
    <Dialog isVisible={show}>
      <View style={styles.headerContainer}>
        <Dialog.Button
          title={currentPage === "menu" ? "Cancel" : "Back"}
          onPress={
            currentPage === "menu" ? handleClose : () => setCurrentPage("menu")
          }
          titleStyle={styles.cancelTextButton}
          buttonStyle={styles.cancelButton}
          containerStyle={styles.cancelButtonContainer}
        />
        <Dialog.Title
          title={currentPage === "menu" ? "Add Field" : currentPage}
        />
      </View>
      {renderContent()}
    </Dialog>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    padding: spacing.md,
  },
  cancelTextButton: {
    fontSize: fonts.md,
  },
  cancelButton: {},
  cancelButtonContainer: {
    flex: 1,
    alignSelf: "flex-start",
  },
  text: {
    fontFamily: fonts.primary,
    fontSize: 16,
    color: colors.palette.dark,
  },
  button: {
    width: 120,
    margin: spacing.xxs,
    backgroundColor: colors.palette.primary,
  },
  buttonText: {
    color: colors.palette.light,
    fontFamily: fonts.primary,
  },
  menuContainer: {
    margin: spacing.sm,
    width: "80%",
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  containerInput: {
    backgroundColor: colors.palette.background,
  },
});

export default Dialogs;
