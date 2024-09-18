import { StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import { Portal, Dialog, Button } from "react-native-paper";

const Dialog_check = ({
  style,
  isVisible,
  setIsVisible,
  actions,
  messages,
  handleDialog,
  data,
}) => {
  const { styles, colors } = style;

  return (
    <Portal>
      <Dialog
        visible={isVisible}
        onDismiss={() => setIsVisible(false)}
        style={styles.containerDialog}
        contentStyle={styles.containerDialog}
      >
        <Dialog.Title style={{ paddingLeft: 8 }}>{actions || ""}</Dialog.Title>
        <Dialog.Content>
          <Text
            style={[styles.textDark, { marginBottom: 10, paddingLeft: 10 }]}
          >
            {messages || ""}
          </Text>

          <Dialog.Actions>
            <Button onPress={() => setIsVisible(false)}>Cancel</Button>
            <Button
              onPress={() => {
                handleDialog(actions, data);
                setIsVisible(false);
              }}
            >
              Ok
            </Button>
          </Dialog.Actions>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

export default Dialog_check;
