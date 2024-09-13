import React, { useEffect, useRef } from "react";
import {
  Text,
  View,
  Pressable,
  FlatList,
  Animated,
  Easing,
} from "react-native";
import { Input, Button } from "@rneui/themed";
import { Entypo, AntDesign } from "@expo/vector-icons";
import { SaveFormDialog, FieldDialog, SubFormDialog } from "./ui";

const Layout1 = ({
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
  shouldRenderDT,
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
  groupCheckListOption,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnimDT = useRef(new Animated.Value(0)).current;
  const { styles, colors, responsive } = style;
  console.log("Layout1");

  const startAnimation = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.in,
      useNativeDriver: true,
    }).start();
  };

  const startAnimationDT = () => {
    Animated.timing(fadeAnimDT, {
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
  const resetAnimationDT = () => {
    Animated.timing(fadeAnimDT, {
      toValue: 0,
      duration: 0,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (!editMode) {
      resetAnimation();
      startAnimation();
    }
  }, [shouldRender, editMode]);

  useEffect(() => {
    if (!editMode) {
      resetAnimationDT();
      startAnimationDT();
    }
  }, [shouldRenderDT, editMode]);

  const renderSubForm = ({ item, index }) => (
    <View style={styles.cardshow}>
      <Pressable
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
      </Pressable>
      {item.fields.map((field, idx) => (
        <Pressable
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
        </Pressable>
      ))}
      <Pressable
        onPress={() => {
          setSelectedIndex((prev) => ({ ...prev, subForm: index }));
          setShowDialogs((prev) => ({ ...prev, field: true }));
        }}
      >
        <Text style={[styles.button, { color: colors.palette.blue }]}>
          <AntDesign name="plus" size={16} color={colors.palette.blue} />
          Add Field
        </Text>
      </Pressable>
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

        <Pressable
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
        </Pressable>
      </View>

      <Pressable
        onPress={() => {
          setEditMode(false);
          setShowDialogs((prev) => ({ ...prev, subForm: true }));
        }}
      >
        <Text style={[styles.button, { color: colors.palette.blue }]}>
          <AntDesign name="plus" size={16} color={colors.palette.blue} />
          Add Sub Form
        </Text>
      </Pressable>

      <FlatList
        data={state.subForms}
        renderItem={renderSubForm}
        keyExtractor={(item, index) => `card-${index}`}
      />

      <SaveFormDialog
        isVisible={showDialogs.save}
        onSave={saveForm}
        onCancel={() => resetForm()}
        onReset={resetForm}
        styles={styles}
        colors={colors}
        responsive={responsive}
      />

      <SubFormDialog
        isVisible={showDialogs.subForm}
        subForm={subForm}
        editMode={editMode}
        onSave={(option) => saveSubForm(option)}
        onCancel={() => resetForm()}
        onDelete={() => saveSubForm("delete")}
        onChange={handleSubForm}
        styles={styles}
        colors={colors}
        responsive={responsive}
        error={error}
      />

      <FieldDialog
        isVisible={showDialogs.field}
        fadeAnim={fadeAnim}
        fadeAnimDT={fadeAnimDT}
        shouldRender={shouldRender}
        shouldRenderDT={shouldRenderDT}
        formState={formState}
        checkList={checkList}
        checkListType={checkListType}
        groupCheckListOption={groupCheckListOption}
        dataType={dataType}
        onSave={(option) => saveField(option)}
        onDelete={() => saveField("delete")}
        onCancel={() => resetForm()}
        onFieldChange={handleFieldChange}
        resetDropdown={resetDropdown}
        styles={styles}
        colors={colors}
        responsive={responsive}
        editMode={editMode}
      />
    </View>
  );
};

export default Layout1;
