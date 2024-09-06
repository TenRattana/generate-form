import React from "react";
import { View, Text } from "react-native";
import { Button, Dialog, Input } from "@rneui/themed";

export const SubFormDialog = ({
  isVisible,
  subForm,
  onSave,
  onCancel,
  onDelete,
  onChange,
  styles,
  colors,
  responsive,
  error,
  editMode,
}) => {
  return (
    <Dialog isVisible={isVisible} overlayStyle={styles.dialogContainer}>
      <Dialog.Title title="Sub Form Details" />
      <Input
        label="Sub Form Name"
        placeholder="Enter Sub Form Name"
        value={subForm.subFormName || ""}
        labelStyle={styles.text}
        inputStyle={[styles.text, { color: colors.palette.dark }]}
        disabledInputStyle={styles.containerInput}
        onChangeText={(text) => onChange("subFormName", text)}
      />
      {error.subFormName ? (
        <Text style={styles.errorText}>{error.subFormName}</Text>
      ) : null}
      <Input
        label="Sub Form Column"
        placeholder="Enter Number of Columns"
        value={subForm.columns || ""}
        labelStyle={styles.text}
        inputStyle={[styles.text, { color: colors.palette.dark }]}
        disabledInputStyle={styles.containerInput}
        onChangeText={(text) => onChange("columns", text)}
      />
      {error.columns ? (
        <Text style={styles.errorText}>{error.columns}</Text>
      ) : null}
      <Input
        label="Sub Form Display Order"
        placeholder="Enter Display Order Number"
        value={subForm.displayOrder || ""}
        labelStyle={styles.text}
        inputStyle={[styles.text, { color: colors.palette.dark }]}
        disabledInputStyle={styles.containerInput}
        onChangeText={(text) => onChange("displayOrder", text)}
      />
      {error.displayOrder ? (
        <Text style={styles.errorText}>{error.displayOrder}</Text>
      ) : null}
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
          title={editMode ? "Update SubForm" : "Add SubForm"}
          onPress={() => onSave(editMode ? "edit" : "add")}
          titleStyle={styles.text}
          containerStyle={[
            styles.containerButton,
            { width: responsive === "small" ? "100%" : "30%" },
          ]}
        />
        {onDelete && editMode ? (
          <Button
            title="Delete Card"
            onPress={onDelete}
            titleStyle={styles.text}
            containerStyle={[
              styles.containerButton,
              { width: responsive === "small" ? "100%" : "30%" },
            ]}
          />
        ) : null}
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
