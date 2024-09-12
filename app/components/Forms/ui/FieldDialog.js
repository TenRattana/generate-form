import React from "react";
import { View, Text, Animated } from "react-native";
import { Button, Dialog, Input } from "@rneui/themed";
import { CustomDropdown } from "../../index";

const FieldDialog = ({
  isVisible,
  fadeAnim,
  fadeAnimDT,
  shouldRender,
  shouldRenderDT,
  formState,
  checkList,
  checkListType,
  dataType,
  onSave,
  onDelete,
  onCancel,
  onFieldChange,
  resetDropdown,
  styles,
  colors,
  responsive,
  editMode,
  matchCheckListOption,
}) => {
  console.log("FieldDialog");

  return (
    <Dialog isVisible={isVisible} overlayStyle={styles.dialogContainer}>
      <View style={styles.viewDialog}>
        <CustomDropdown
          fieldName="checkListId"
          title="Check List"
          labels="CListName"
          values="CListID"
          data={checkList}
          updatedropdown={(f, v) => onFieldChange(f, v)}
          reset={resetDropdown}
          selectedValue={formState.checkListId}
        />
        <CustomDropdown
          fieldName="checkListTypeId"
          title="Check list Type"
          labels="CTypeName"
          values="CTypeID"
          data={checkListType}
          updatedropdown={(f, v) => onFieldChange(f, v)}
          reset={resetDropdown}
          selectedValue={formState.checkListTypeId}
        />

        <Animated.View style={[styles.animatedText, { opacity: fadeAnim }]}>
          {shouldRender === "detail" ? (
            <>
              <CustomDropdown
                fieldName="matchCheckListOption"
                title="Match Check List Option Group"
                labels="MCLOptionName"
                values="MCLOptionID"
                data={matchCheckListOption}
                updatedropdown={(f, v) => onFieldChange(f, v)}
                reset={resetDropdown}
                selectedValue={formState.matchCheckListOption}
              />
            </>
          ) : shouldRender === "text" ? (
            <>
              <CustomDropdown
                fieldName="dataTypeId"
                title="Data Type"
                labels="DTypeName"
                values="DTypeID"
                data={dataType}
                updatedropdown={(f, v) => onFieldChange(f, v)}
                reset={resetDropdown}
                selectedValue={formState.dataTypeId}
              />
              {shouldRenderDT ? (
                <Animated.View
                  style={[styles.animatedText, { opacity: fadeAnimDT }]}
                >
                  <Input
                    label="Digit Length"
                    placeholder="Enter Digit Length"
                    labelStyle={[styles.text, { color: colors.text }]}
                    inputStyle={[styles.text, { color: colors.text }]}
                    disabledInputStyle={styles.containerInput}
                    onChangeText={(text) =>
                      onFieldChange("dataTypeValue", text)
                    }
                    value={formState.dataTypeValue}
                  />
                </Animated.View>
              ) : null}
              <Input
                label="Minimum Length"
                placeholder="Enter Minimum Length"
                labelStyle={[styles.text, { color: colors.text }]}
                inputStyle={[styles.text, { color: colors.text }]}
                disabledInputStyle={styles.containerInput}
                onChangeText={(text) => onFieldChange("minLength", text)}
                value={formState.minLength}
              />
              <Input
                label="Maximum Length"
                placeholder="Enter Maximum Length"
                labelStyle={[styles.text, { color: colors.text }]}
                inputStyle={[styles.text, { color: colors.text }]}
                disabledInputStyle={styles.containerInput}
                onChangeText={(text) => onFieldChange("maxLength", text)}
                value={formState.maxLength}
              />
              <Input
                label="Placeholder"
                placeholder="Enter Placeholder"
                labelStyle={[styles.text, { color: colors.text }]}
                inputStyle={[styles.text, { color: colors.text }]}
                disabledInputStyle={styles.containerInput}
                onChangeText={(text) => onFieldChange("placeholder", text)}
                value={formState.placeholder}
              />
              <Input
                label="Hint"
                placeholder="Enter Hint"
                labelStyle={[styles.text, { color: colors.text }]}
                inputStyle={[styles.text, { color: colors.text }]}
                disabledInputStyle={styles.containerInput}
                onChangeText={(text) => onFieldChange("hint", text)}
                value={formState.hint}
              />
            </>
          ) : null}
        </Animated.View>

        <Input
          label="Display Order"
          placeholder="Enter Display Order"
          labelStyle={[styles.text, { color: colors.text }]}
          inputStyle={[styles.text, { color: colors.text }]}
          disabledInputStyle={styles.containerInput}
          onChangeText={(text) => onFieldChange("displayOrder", text)}
          value={formState.displayOrder}
        />
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
            title={editMode ? "Update Field" : "Add Field"}
            onPress={() => onSave(editMode ? "edit" : "add")}
            titleStyle={styles.text}
            containerStyle={[
              styles.containerButton,
              { width: responsive === "small" ? "100%" : "30%" },
            ]}
          />
          {onDelete && editMode ? (
            <Button
              title="Delete Field"
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
      </View>
    </Dialog>
  );
};

export default FieldDialog;
