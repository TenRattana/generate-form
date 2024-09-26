import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import formStyles from "../../styles/forms/form";
import { useTheme } from "../../contexts";
import DraggableFlatList from "react-native-draggable-flatlist";

const Test = () => {
  const [dataSub, setDataSub] = useState(
    {
      checkListId: "CL004",
      checkListTypeId: "CT03",
      dataTypeId: "DT01",
      dataTypeValue: "",
      description: "",
      displayOrder: 1,
      expectedResult: "",
      groupCheckListOptionId: "GCLO003",
      hint: "",
      matchCheckListId: 74,
      maxLength: "",
      minLength: "",
      placeholder: "",
      require: true,
      subFormId: "SF032",
    },
    {
      checkListId: "CL007",
      checkListTypeId: "CT04",
      dataTypeId: "DT01",
      dataTypeValue: "",
      description: "",
      displayOrder: 2,
      expectedResult: "",
      groupCheckListOptionId: "GCLO004",
      hint: "",
      matchCheckListId: 75,
      maxLength: "",
      minLength: "",
      placeholder: "",
      require: false,
      subFormId: "SF032",
    },
    {
      checkListId: "CL005",
      checkListTypeId: "CT05",
      dataTypeId: "DT01",
      dataTypeValue: "",
      description: "",
      displayOrder: 1,
      expectedResult: "",
      groupCheckListOptionId: "GCLO003",
      hint: "",
      matchCheckListId: 76,
      maxLength: "",
      minLength: "",
      placeholder: "",
      require: false,
      subFormId: "SF033",
    },
    {
      checkListId: "CL009",
      checkListTypeId: "CT03",
      dataTypeId: "DT01",
      dataTypeValue: "",
      description: "",
      displayOrder: 1,
      expectedResult: "",
      groupCheckListOptionId: "GCLO005",
      hint: "",
      matchCheckListId: 77,
      maxLength: "",
      minLength: "",
      placeholder: "",
      require: false,
      subFormId: "SF034",
    }
  );

  const { colors, spacing, fonts } = useTheme();
  const styles = formStyles({ colors, spacing, fonts });

  const renderSubForm = ({ item, drag, isActive }) => (
    <TouchableOpacity
      onLongPress={drag}
      disabled={isActive}
      style={[
        styles.button,
        isActive ? styles.backLight : styles.backSuccess,
        {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          isActive ? styles.textDark : styles.textLight,
          { paddingLeft: 15 },
        ]}
      >
        Sub Form: {item.subFormName}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        {
          flex: 1,
          paddingTop: 50,
          overflow: "hidden",
          backgroundColor: "#f5f5f5",
        },
      ]}
    >
      <View style={styles.layout1}>
        <DraggableFlatList
          data={dataSub.subForm}
          renderItem={renderSubForm}
          keyExtractor={(item) => item.subFormId}
          onDragEnd={({ data }) =>
            setDataSub((prev) => ({ ...prev, subForm: data }))
          }
        />
      </View>
    </View>
  );
};

export default Test;
