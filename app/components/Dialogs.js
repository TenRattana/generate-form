import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import { Button, Dialog } from "@rneui/themed";
import { colors, spacing, fonts } from "../../theme";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useResponsive } from "./useResponsive";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const Dialogs = ({ select, OpenDialog }) => {
  const [DialogField, setDialogField] = useState(false);
  const responsive = useResponsive();
  const { width } = Dimensions.get("window");

  const OpenDialogs = () => {
    OpenDialog(!DialogField);
  };

  useEffect(() => {
    setDialogField(select);
  }, [select]);

  const styles = StyleSheet.create({
    containerButton: {
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
      fontSize: responsive === "small" ? fonts.smx : fonts.sm,
      color: colors.palette.light,
    },
    containerButtonDialog: {
      alignItems: "center",
      justifyContent: "flex-start",
    },
    containerDialog: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    dialogContainer: {
      padding: spacing.sm,
      width: 350,
      height: 180,
      alignSelf: "center",
      position: "absolute",
      top: 100,
      left: "2%",
    },
    icon: {
      marginBottom: spacing.xxxs,
    },
  });

  return (
    <Dialog
      isVisible={DialogField}
      onBackdropPress={OpenDialogs}
      overlayStyle={styles.dialogContainer}
    >
      <Dialog.Title title="Add Field" />
      <View style={styles.containerDialog}>
        <View style={styles.containerButtonDialog}>
          <Button
            buttonStyle={styles.containerButton}
            containerStyle={styles.containerButtonDialog}
            icon={
              <MaterialCommunityIcons
                name="format-text"
                size={20}
                color={colors.palette.light}
                style={styles.icon}
              />
            }
            iconPosition="top"
            title={<Text style={styles.buttonText}>Text Input</Text>}
            titleStyle={styles.buttonText}
          />
        </View>
        <View style={styles.containerButtonDialog}>
          <Button
            buttonStyle={styles.containerButton}
            containerStyle={styles.containerButtonDialog}
            icon={
              <Feather
                name="list"
                size={20}
                color={colors.palette.light}
                style={styles.icon}
              />
            }
            iconPosition="top"
            title={<Text style={styles.buttonText}>Dropdown</Text>}
            titleStyle={styles.buttonText}
          />
        </View>
        <View style={styles.containerButtonDialog}>
          <Button
            buttonStyle={styles.containerButton}
            containerStyle={styles.containerButtonDialog}
            icon={
              <Ionicons
                name="radio-button-on"
                size={20}
                color={colors.palette.light}
                style={styles.icon}
              />
            }
            iconPosition="top"
            title={<Text style={styles.buttonText}>Radio</Text>}
            titleStyle={styles.buttonText}
          />
        </View>
        <View style={styles.containerButtonDialog}>
          <Button
            buttonStyle={styles.containerButton}
            containerStyle={styles.containerButtonDialog}
            icon={
              <FontAwesome5
                name="text-width"
                size={20}
                color={colors.palette.light}
                style={styles.icon}
              />
            }
            iconPosition="top"
            title={<Text style={styles.buttonText}>Textarea</Text>}
            titleStyle={styles.buttonText}
          />
        </View>
        <View style={styles.containerButtonDialog}>
          <Button
            buttonStyle={styles.containerButton}
            containerStyle={styles.containerButtonDialog}
            icon={
              <AntDesign
                name="checksquare"
                size={20}
                color={colors.palette.light}
                style={styles.icon}
              />
            }
            iconPosition="top"
            title={<Text style={styles.buttonText}>Checkbox</Text>}
            titleStyle={styles.buttonText}
          />
        </View>
        <View style={styles.containerButtonDialog}>
          <Button
            buttonStyle={styles.containerButton}
            containerStyle={styles.containerButtonDialog}
            icon={
              <AntDesign
                name="addfile"
                size={20}
                color={colors.palette.light}
                style={styles.icon}
              />
            }
            iconPosition="top"
            title={<Text style={styles.buttonText}>File</Text>}
            titleStyle={styles.buttonText}
          />
        </View>
      </View>
    </Dialog>
  );
};

export default Dialogs;
