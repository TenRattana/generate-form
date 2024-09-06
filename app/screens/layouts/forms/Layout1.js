import React, { useEffect, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Animated,
  Easing,
} from "react-native";
import { Input, Button, Dialog } from "@rneui/themed";
import { Entypo, AntDesign } from "@expo/vector-icons";
import { CustomDropdown } from "../../../components";

export default function LayoutTool({
  style,
  state,
  error,
  handleSubForm,
  saveSubForm,
  subForm,
  form,
  editMode,
  resetForm,
  setEditMode,
  shouldRender,
  setShowDialogs,
  showDialogs,
  setSelectedIndex,
  setSubForm,
  handleForm,
  saveForm,
  saveField,
  setFormState,
  handleFieldChange,
  formState,
  checkList,
  resetDropdown,
  checkListType,
  dataType,
}) {
  console.log("Layout1");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { styles, colors, responsive } = style;

  const startAnimation = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.in,
      useNativeDriver: true,
    }).start();
  };

  const resetAnimation = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 0,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    resetAnimation();
    startAnimation();
  }, [shouldRender]);

  const renderSubForm = ({ item, index }) => (
    <View style={styles.cardshow}>
      <TouchableOpacity
        onPress={() => {
          setSubForm(item);
          setSelectedIndex((prev) => ({ ...prev, subForm: index }));
          setShowDialogs((prev) => ({ ...prev, subForm: true }));
          setEditMode(true);
        }}
        style={styles.button}
      >
        <Text style={styles.text}>Sub Form : {item.subFormName}</Text>
        <Entypo name="chevron-right" size={18} color={colors.palette.light} />
      </TouchableOpacity>
      {item.fields.map((field, idx) => (
        <TouchableOpacity
          key={`${field.CheckListName}-${idx}`}
          onPress={() => {
            setSelectedIndex((prev) => ({
              ...prev,
              subForm: index,
              field: idx,
            }));
            setEditMode(true);
            setFormState(field);
            setShowDialogs((prev) => ({ ...prev, field: true }));
          }}
          style={styles.button}
        >
          <Text style={styles.text}>{field.CheckListName}</Text>
          <Entypo name="chevron-right" size={18} color={colors.palette.light} />
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        onPress={() => {
          setSelectedIndex((prev) => ({ ...prev, subForm: index }));
          setShowDialogs((prev) => ({ ...prev, field: true }));
        }}
      >
        <Text style={[styles.button, { color: colors.palette.blue }]}>
          <AntDesign name="plus" size={16} color={colors.palette.blue} />
          Add Field
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View>
      <View>
        <Input
          label="Content Name"
          placeholder="Enter Content Name"
          labelStyle={styles.text}
          inputStyle={styles.text}
          disabledInputStyle={styles.containerInput}
          onChangeText={(text) => handleForm("formName", text)}
          value={form.formName}
        />
        <Input
          label="Content Description"
          placeholder="Enter Content Description"
          labelStyle={styles.text}
          inputStyle={styles.text}
          disabledInputStyle={styles.containerInput}
          onChangeText={(text) => handleForm("description", text)}
          value={form.description}
        />

        <TouchableOpacity
          onPress={() => {
            setEditMode(false);
            setShowDialogs((prev) => ({ ...prev, save: true }));
          }}
          style={{ marginTop: 10 }}
        >
          <Text
            style={[
              styles.button,
              {
                color: colors.palette.light,
                backgroundColor: colors.palette.green,
              },
            ]}
          >
            Save Form
          </Text>
        </TouchableOpacity>

        <Dialog
          isVisible={showDialogs.save}
          overlayStyle={styles.dialogContainer}
        >
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
              onPress={() => saveForm()}
              titleStyle={styles.text}
              containerStyle={[
                styles.containerButton,
                { width: responsive === "small" ? "100%" : "30%" },
              ]}
            />
            <Button
              title="Cancel"
              onPress={() => resetForm()}
              titleStyle={styles.text}
              containerStyle={[
                styles.containerButton,
                { width: responsive === "small" ? "100%" : "30%" },
              ]}
            />
          </View>
        </Dialog>
      </View>

      <TouchableOpacity
        onPress={() => {
          setEditMode(false);
          setShowDialogs((prev) => ({ ...prev, subForm: true }));
        }}
      >
        <Text style={[styles.button, { color: colors.palette.blue }]}>
          <AntDesign name="plus" size={16} color={colors.palette.blue} />
          Add Sub Form
        </Text>
      </TouchableOpacity>

      <FlatList
        data={state.subForms}
        renderItem={renderSubForm}
        keyExtractor={(item, index) => `card-${index}`}
      />

      <Dialog
        isVisible={showDialogs.subForm}
        overlayStyle={styles.dialogContainer}
      >
        <Dialog.Title title="Sub Form Details" />
        <Input
          label="Sub Form Name"
          placeholder="Enter Sub Form Name"
          value={subForm.subFormName || ""}
          labelStyle={styles.text}
          inputStyle={[styles.text, { color: colors.palette.dark }]}
          disabledInputStyle={styles.containerInput}
          onChangeText={(text) => handleSubForm("subFormName", text)}
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
          onChangeText={(text) => handleSubForm("columns", text)}
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
          onChangeText={(text) => handleSubForm("displayOrder", text)}
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
            title={editMode ? "Update Card" : "Add SubForm"}
            onPress={() => saveSubForm(editMode ? "edit" : "add")}
            titleStyle={styles.text}
            containerStyle={[
              styles.containerButton,
              { width: responsive === "small" ? "100%" : "30%" },
            ]}
          />
          {editMode && (
            <Button
              title="Delete Card"
              onPress={() => saveSubForm("delete")}
              titleStyle={styles.text}
              containerStyle={[
                styles.containerButton,
                { width: responsive === "small" ? "100%" : "30%" },
              ]}
            />
          )}
          <Button
            title="Cancel"
            onPress={() => resetForm()}
            titleStyle={styles.text}
            containerStyle={[
              styles.containerButton,
              { width: responsive === "small" ? "100%" : "30%" },
            ]}
          />
        </View>
      </Dialog>

      <Dialog
        isVisible={showDialogs.field}
        overlayStyle={styles.dialogContainer}
      >
        <View style={styles.viewDialog}>
          <CustomDropdown
            fieldName="checkListId"
            title="Check List"
            labels="CListName"
            values="CListID"
            data={checkList}
            updatedropdown={(f, v) => handleFieldChange(f, v)}
            reset={resetDropdown}
            selectedValue={formState.checkListId}
          />
          <CustomDropdown
            fieldName="checkListTypeId"
            title="Check list Type"
            labels="CTypeName"
            values="CTypeID"
            data={checkListType}
            updatedropdown={(f, v) => handleFieldChange(f, v)}
            reset={resetDropdown}
            selectedValue={formState.checkListTypeId}
          />

          <Animated.View style={[styles.animatedText, { opacity: fadeAnim }]}>
            {shouldRender === "detail" ? (
              <React.Fragment>
                <Input
                  label="Placeholder"
                  placeholder="Enter Placeholder"
                  labelStyle={[styles.text, { color: colors.text }]}
                  inputStyle={[styles.text, { color: colors.text }]}
                  disabledInputStyle={styles.containerInput}
                  onChangeText={(text) =>
                    handleFieldChange("placeholder", text)
                  }
                  value={formState.placeholder}
                />
                {/* <CustomDropdown
                fieldName="matchListDetailId"
                title="Group List Detail"
                labels="ListName"
                values="MLDetailID"
                data={matchListDetail}
                updatedropdown={(f, v) => handleFieldChange(f, v)}
                reset={resetDropdown}
                selectedValue={formState.matchListDetailId}
              /> */}
              </React.Fragment>
            ) : shouldRender === "text" ? (
              <React.Fragment>
                <CustomDropdown
                  fieldName="dataTypeId"
                  title="Data Type"
                  labels="DTypeName"
                  values="DTypeID"
                  data={dataType}
                  updatedropdown={(f, v) => handleFieldChange(f, v)}
                  reset={resetDropdown}
                  selectedValue={formState.dataTypeId}
                />
                <Input
                  label="Placeholder"
                  placeholder="Enter Placeholder"
                  labelStyle={[styles.text, { color: colors.text }]}
                  inputStyle={[styles.text, { color: colors.text }]}
                  disabledInputStyle={styles.containerInput}
                  onChangeText={(text) =>
                    handleFieldChange("placeholder", text)
                  }
                  value={formState.placeholder}
                />
                <Input
                  label="Hint"
                  placeholder="Enter Hint"
                  labelStyle={[styles.text, { color: colors.text }]}
                  inputStyle={[styles.text, { color: colors.text }]}
                  disabledInputStyle={styles.containerInput}
                  onChangeText={(text) => handleFieldChange("hint", text)}
                  value={formState.hint}
                />
              </React.Fragment>
            ) : null}
          </Animated.View>

          <Input
            label="Display Order"
            placeholder="Enter Display Order"
            labelStyle={[styles.text, { color: colors.text }]}
            inputStyle={[styles.text, { color: colors.text }]}
            disabledInputStyle={styles.containerInput}
            onChangeText={(text) => handleFieldChange("displayOrder", text)}
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
              onPress={() => saveField(editMode ? "edit" : "add")}
              titleStyle={styles.text}
              containerStyle={[
                styles.containerButton,
                { width: responsive === "small" ? "100%" : "30%" },
              ]}
            />
            {editMode && (
              <Button
                title={"Delete Field"}
                onPress={() => saveField("delete")}
                titleStyle={styles.text}
                containerStyle={[
                  styles.containerButton,
                  { width: responsive === "small" ? "100%" : "30%" },
                ]}
              />
            )}

            <Button
              title="Cancel"
              onPress={() => resetForm()}
              titleStyle={styles.text}
              containerStyle={[
                styles.containerButton,
                { width: responsive === "small" ? "100%" : "30%" },
              ]}
            />
          </View>
        </View>
      </Dialog>
    </View>
  );
}
