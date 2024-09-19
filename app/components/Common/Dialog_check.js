import React, { useMemo, useState } from "react";
import { View, Pressable } from "react-native";
import { Portal, Dialog, Button, Text } from "react-native-paper";

const Dialog_check = ({
  style,
  isVisible,
  setIsVisible,
  actions,
  title,
  messages,
  handleDialog,
  data,
}) => {
  const { styles, colors } = style;
  console.log("Dialog_checkble");

  return (
    <Portal>
      <Dialog
        visible={isVisible}
        onDismiss={() => setIsVisible(false)}
        style={styles.containerDialog}
        contentStyle={styles.containerDialog}
      >
        <Dialog.Icon icon="alert" size={90} />

        <Dialog.Title style={{ alignSelf: "center" }}>
          {title || ""}
        </Dialog.Title>
        <Dialog.Content>
          <Text
            variant="bodyMedium"
            style={[
              styles.textDark,
              { marginBottom: 10, paddingLeft: 10, alignSelf: "center" },
            ]}
          >
            You have selected{" "}
            <Text style={[styles.text, styles.textError]}>
              {messages || ""}
            </Text>
            . Please confirm your action.
          </Text>

          <View style={styles.containerFlexStyle}>
            <Pressable
              onPress={() => {
                handleDialog(actions, data);
                setIsVisible(false);
              }}
              style={[styles.buttonD, styles.backSucceass]}
            >
              <Text style={[styles.textBold, styles.text, styles.textLight]}>
                Ok
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setIsVisible(false)}
              style={[styles.buttonD, styles.backDis]}
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

export default Dialog_check;
