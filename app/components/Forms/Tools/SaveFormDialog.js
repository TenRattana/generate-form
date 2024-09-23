import React from "react";
import { View, Pressable } from "react-native";
import { Portal, Dialog, Text } from "react-native-paper";

const SaveFormDialog = ({
  isVisible,
  setShowDialogs,
  styles,
  responsive,
  saveForm,
}) => {
  console.log("SaveFormDialog");

  return (
    <Portal>
      <Dialog
        visible={isVisible}
        onDismiss={() => setShowDialogs()}
        style={styles.containerDialog}
        contentStyle={styles.containerDialog}
      >
        <Dialog.Title style={{ paddingLeft: 8 }}>Save Form</Dialog.Title>
        <Dialog.Content>
          <Text
            style={[styles.textDark, { marginBottom: 10, paddingLeft: 10 }]}
          >
            You are about to save the form. Are you sure?
          </Text>

          <View
            style={[
              styles.containerButton,
              {
                flexDirection: responsive === "small" ? "column" : "row",
                justifyContent: "center",
              },
            ]}
          >
            <Pressable
              onPress={() => saveForm()}
              style={[styles.button, styles.backMain, styles.bwidth]}
            >
              <Text style={[styles.textBold, styles.text, styles.textLight]}>
                Save
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setShowDialogs()}
              style={[styles.button, styles.backMain, styles.bwidth]}
            >
              <Text style={[styles.textBold, styles.text, styles.textLight]}>
                Cancel
              </Text>
            </Pressable>
          </View>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

export default SaveFormDialog;
