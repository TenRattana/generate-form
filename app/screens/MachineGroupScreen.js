import React, { useState, useCallback, useMemo } from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import axios from "../../config/axios";
import { Card } from "@rneui/themed";
import { CustomTable, LoadingSpinner, Dialog_mg } from "../components";
import { useTheme, useToast, useRes } from "../contexts";
import screenStyles from "../styles/screens/screen";
import { useFocusEffect } from "@react-navigation/native";

const MachineGroupScreen = React.memo(() => {
  const [machineGroup, setMachineGroup] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [initialValues, setInitialValues] = useState({
    machineGroupId: "",
    machineGroupName: "",
    displayOrder: "",
    description: "",
  });

  const { colors, fonts, spacing } = useTheme();
  const { Toast } = useToast();
  const { responsive } = useRes();
  const styles = screenStyles({ colors, spacing, fonts, responsive });

  const ShowMessages = (textH, textT, color) => {
    Toast.show({
      type: "customToast",
      text1: textH,
      text2: textT,
      text1Style: [styles.text, { color: colors.palette.dark }],
      text2Style: [styles.text, { color: colors.palette.dark }],
    });
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const response = await axios.post(
            "MachineGroup_service.asmx/GetMachineGroups"
          );
          setMachineGroup(response.data.data ?? []);
          setIsLoading(true);
        } catch (error) {
          ShowMessages(
            error.message || "Error",
            error.response
              ? error.response.data.errors
              : ["Something went wrong!"],
            "error"
          );
        }
      };

      fetchData();
      return () => {
        setInitialValues({
          machineGroupId: "",
          machineGroupName: "",
          displayOrder: "",
          description: "",
        });
        setIsEditing(false);
      };
    }, [])
  );

  const saveData = async (values) => {
    setIsLoadingButton(true);

    const data = {
      MGroupID: values.machineGroupId,
      MGroupName: values.machineGroupName,
      DisplayOrder: values.displayOrder,
      Description: values.description,
    };

    try {
      await axios.post("MachineGroup_service.asmx/SaveMachineGroup", data);
      const response = await axios.post(
        "MachineGroup_service.asmx/GetMachineGroups"
      );
      setMachineGroup(response.data.data ?? []);
      setIsVisible(!response.data.status);
    } catch (error) {
      ShowMessages(
        error.message || "Error",
        error.response ? error.response.data.errors : ["Something went wrong!"],
        "error"
      );
    } finally {
      setIsLoadingButton(false);
    }
  };

  const handleAction = async (action, item) => {
    try {
      if (action === "editIndex") {
        const response = await axios.post(
          "MachineGroup_service.asmx/GetMachineGroup",
          { MGroupID: item }
        );
        const machineGroupData = response.data.data[0] ?? {};
        setInitialValues({
          machineGroupId: machineGroupData.MGroupID ?? "",
          machineGroupName: machineGroupData.MGroupName ?? "",
          description: machineGroupData.Description ?? "",
          displayOrder: String(machineGroupData.DisplayOrder) ?? "",
        });
        setIsVisible(true);
        setIsEditing(true);
      } else {
        if (action === "activeIndex") {
          await axios.post("MachineGroup_service.asmx/ChangeMachineGroup", {
            MGroupID: item,
          });
        } else if (action === "delIndex") {
          await axios.post("MachineGroup_service.asmx/DeleteMachineGroup", {
            MGroupID: item,
          });
        }
        const response = await axios.post(
          "MachineGroup_service.asmx/GetMachineGroups"
        );
        setMachineGroup(response.data.data ?? []);
      }
    } catch (error) {
      ShowMessages(
        error.message || "Error",
        error.response ? error.response.data.errors : ["Something went wrong!"],
        "error"
      );
    }
  };

  useMemo(() => {
    if (!isVisible) {
      setInitialValues({
        machineGroupId: "",
        machineGroupName: "",
        displayOrder: "",
        description: "",
      });
      setIsEditing(false);
    }
  }, [isVisible]);

  const tableData = machineGroup.map((item) => [
    item.MGroupName,
    item.Description,
    item.DisplayOrder,
    item.IsActive,
    item.MGroupID,
    item.MGroupID,
    item.MGroupID,
  ]);

  const tableHead = [
    "Machine Group Name",
    "Description",
    "Priority",
    "",
    "Change Status",
    "Edit",
    "Delete",
  ];

  return (
    <View style={styles.scrollView}>
      <ScrollView>
        <Card>
          <Card.Title>List Group Machine</Card.Title>
          <Card.Divider />

          <Pressable
            onPress={() => setIsVisible(true)}
            style={[styles.button, styles.backMain]}
          >
            <Text style={[styles.text, styles.textLight]}>
              Create Group Machine
            </Text>
          </Pressable>

          {isLoading ? (
            <CustomTable
              Tabledata={tableData}
              Tablehead={tableHead}
              flexArr={[3, 4, 1, 1, 1, 1]}
              actionIndex={[{ activeIndex: 4, editIndex: 5, delIndex: 6 }]}
              handleAction={handleAction}
            />
          ) : (
            <LoadingSpinner />
          )}
        </Card>
      </ScrollView>

      <Dialog_mg
        style={{ styles, colors, spacing, responsive, fonts }}
        isVisible={isVisible}
        isEditing={isEditing}
        initialValues={initialValues}
        saveData={saveData}
        setIsVisible={setIsVisible}
      />
    </View>
  );
});

export default MachineGroupScreen;
