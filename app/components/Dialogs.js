import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Dialog } from "@rneui/themed";
import { colors, spacing, fonts } from "../../theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const Dialogs = ({ isVisible, onClose }) => {
  const [currentPage, setCurrentPage] = useState("menu"); 

  const renderContent = () => {
    switch (currentPage) {
      case "textInput":
        return <Text>Text Input Content</Text>;
      case "dropdown":
        return <Text>Dropdown Content</Text>;
      case "radio":
        return <Text>Radio Content</Text>;
      case "textarea":
        return <Text>Textarea Content</Text>;
      case "checkbox":
        return <Text>Checkbox Content</Text>;
      case "file":
        return <Text>File Content</Text>;
      default:
        return (
          <View style={styles.menuContainer}>
            <Dialog.Button
              buttonStyle={styles.button}
              icon={<MaterialCommunityIcons name="format-text" size={20} color={colors.palette.light} />}
              iconPosition="top"
              title={<Text style={styles.buttonText}>Text Input</Text>}
              onPress={() => setCurrentPage("textInput")}
            />
            <Dialog.Button
              buttonStyle={styles.button}
              icon={<Feather name="list" size={20} color={colors.palette.light} />}
              iconPosition="top"
              title={<Text style={styles.buttonText}>Dropdown</Text>}
              onPress={() => setCurrentPage("dropdown")}
            />
            <Dialog.Button
              buttonStyle={styles.button}
              icon={<Ionicons name="radio-button-on" size={20} color={colors.palette.light} />}
              iconPosition="top"
              title={<Text style={styles.buttonText}>Radio</Text>}
              onPress={() => setCurrentPage("radio")}
            />
            <Dialog.Button
              buttonStyle={styles.button}
              icon={<FontAwesome5 name="text-width" size={20} color={colors.palette.light} />}
              iconPosition="top"
              title={<Text style={styles.buttonText}>Textarea</Text>}
              onPress={() => setCurrentPage("textarea")}
            />
            <Dialog.Button
              buttonStyle={styles.button}
              icon={<AntDesign name="checksquare" size={20} color={colors.palette.light} />}
              iconPosition="top"
              title={<Text style={styles.buttonText}>Checkbox</Text>}
              onPress={() => setCurrentPage("checkbox")}
            />
            <Dialog.Button
              buttonStyle={styles.button}
              icon={<AntDesign name="addfile" size={20} color={colors.palette.light} />}
              iconPosition="top"
              title={<Text style={styles.buttonText}>File</Text>}
              onPress={() => setCurrentPage("file")}
            />
          </View>
        );
    }
  };

  return (
    <Dialog
      isVisible={isVisible}
      onBackdropPress={onClose}
      overlayStyle={styles.dialogContainer}
    >
      <View style={styles.headerContainer}>
        <Dialog.Title title="Add Field" />
        <Dialog.Button
          title="CANCEL"
          onPress={onClose}
          buttonStyle={styles.cancelButton}
          containerStyle={styles.cancelButtonContainer}
        />
      </View>
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  dialogContainer: {
    padding: spacing.sm,
    width: 350,
    height: 400,
    alignSelf: "center",
    position: "absolute",
    top: 100,
    left: "2%",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: colors.palette.background2,
  },
  cancelButtonContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  menuContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  button: {
    padding: 2,
    backgroundColor: colors.palette.background2,
    borderColor: colors.palette.dark4,
    borderWidth: 1,
    width: 100,
    height: 50,
    borderRadius: spacing.xxs,
    margin: spacing.xxs,
  },
  buttonText: {
    fontSize: fonts.sm,
    color: colors.palette.light,
  },
  contentContainer: {
    marginTop: spacing.sm,
    alignItems: "center",
  },
});

export default Dialogs;
