import React from "react";
import { View, Text } from "react-native";
import { Button, Dialog } from "@rneui/themed";

const SaveFormDialog = ({
  isVisible,
  onSave,
  onCancel,
  onReset,
  styles,
  colors,
  responsive,
}) => {
  return (
    <Dialog isVisible={isVisible} overlayStyle={styles.dialogContainer}>
      <Dialog.Title title="Save Form" />
      <Text
        style={[
          styles.textHeader,
          styles.text,
          {
            justifyContent: "center",
            color: colors.palette.dark,
            fontWeight: "regular",
          },
        ]}
      >
        You are about to save the form. Are you sure?
      </Text>
      <View
        style={[
          styles.viewDialog,
          {
            flexDirection: responsive === "small" ? "column" : "row",
            justifyContent: "center",
          },
        ]}
      >
        <Button
          title="Save"
          onPress={onSave}
          titleStyle={styles.text}
          containerStyle={[
            styles.containerButton,
            { width: responsive === "small" ? "100%" : "30%" },
          ]}
        />
        <Button
          title="Cancel"
          onPress={onCancel}
          titleStyle={styles.text}
          containerStyle={[
            styles.containerButton,
            { width: responsive === "small" ? "100%" : "30%" },
          ]}
        />
      </View>
    </Dialog>
  );
};

export default SaveFormDialog;
