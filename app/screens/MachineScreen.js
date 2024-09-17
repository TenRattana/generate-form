import React, { useState, useCallback, useMemo } from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import axios from "../../config/axios";
import { Card } from "@rneui/themed";
import {
  CustomTable,
  CustomDropdown,
  LoadingSpinner,
  Dialog_m,
} from "../components";
import { useTheme, useToast, useRes } from "../../contexts";
import screenStyles from "../../styles/screens/screen";
import { useFocusEffect } from "@react-navigation/native";

const MachineScreen = React.memo(() => {
  const [machine, setMachine] = useState([]);
  const [machineGroup, setMachineGroup] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [resetDropdown, setResetDropdown] = useState(false);
  const [initialValues, setInitialValues] = useState({
    machineId: "",
    machineGroupId: "",
    machineName: "",
    displayOrder: "",
    description: "",
  });

  const { colors, fonts, spacing } = useTheme();
  const { Toast } = useToast();
  const { responsive } = useRes();
  const styles = screenStyles({ colors, spacing, fonts, responsive });
  console.log("MachineScreen");

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
          const [machineResponse, machineGroupResponse] = await Promise.all([
            axios.post("Machine_service.asmx/GetMachines"),
            axios.post("MachineGroup_service.asmx/GetMachineGroups"),
          ]);
          setMachine(machineResponse.data.data ?? []);
          setMachineGroup(machineGroupResponse.data.data ?? []);
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
          machineId: "",
          machineGroupId: "",
          machineName: "",
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
      MachineID: values.machineId,
      MGroupID: values.machineGroupId,
      MachineName: values.machineName,
      DisplayOrder: values.displayOrder,
      Description: values.description,
    };

    try {
      await axios.post("Machine_service.asmx/SaveMachine", data);
      const response = await axios.post("Machine_service.asmx/GetMachines");
      setMachine(response.data.data ?? []);
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
        const response = await axios.post("Machine_service.asmx/GetMachine", {
          machineID: item,
        });
        const machineData = response.data.data[0] ?? {};
        setInitialValues({
          machineId: machineData.MachineID ?? "",
          machineGroupId: machineData.MGroupID ?? "",
          machineName: machineData.MachineName ?? "",
          description: machineData.Description ?? "",
          displayOrder: String(machineData.DisplayOrder) ?? "",
        });
        setIsVisible(true);
        setIsEditing(true);
      } else {
        if (action === "activeIndex") {
          await axios.post("Machine_service.asmx/ChangeMachine", {
            MachineID: item,
          });
        } else if (action === "delIndex") {
          await axios.post("Machine_service.asmx/DeleteMachine", {
            MachineID: item,
          });
        }
        const response = await axios.post("Machine_service.asmx/GetMachines");
        setMachine(response.data.data ?? []);
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
        machineId: "",
        machineGroupId: "",
        machineName: "",
        displayOrder: "",
        description: "",
      });
      setIsEditing(false);
      setResetDropdown(true);
      setTimeout(() => setResetDropdown(false), 0);
    }
  }, [isVisible]);

  const tableData = machine.map((item) => {
    return [
      machineGroup.find((group) => group.MGroupID === item.MGroupID)
        ?.MGroupName || "",
      item.MachineName,
      item.Description,
      item.DisplayOrder,
      item.IsActive,
      item.MachineID,
      item.MachineID,
      item.MachineID,
    ];
  });

  const tableHead = [
    "Machine Group Name",
    "Machine Name",
    "Description",
    "Priority",
    "Status",
    "Change Status",
    "Edit",
    "Delete",
  ];

  const actionIndex = [
    {
      activeIndex: 5,
      editIndex: 6,
      delIndex: 7,
    },
  ];

  let dropmachineGroup = [];

  dropmachineGroup =
    Array.isArray(machineGroup) && machineGroup.length > 0
      ? machineGroup.filter((v) => v.IsActive)
      : dropmachineGroup;

  const customtableProps = {
    Tabledata: tableData,
    Tablehead: tableHead,
    flexArr: [3, 3, 3, 1, 1, 2],
    actionIndex,
    handleAction,
  };

  const dialog_mProps = {
    dropmachineGroup,
    machineGroup,
    style: { styles, colors, spacing, responsive, fonts },
    isVisible,
    isEditing,
    initialValues,
    saveData,
    setIsVisible,
  };

  return (
    <View style={styles.scrollView}>
      <ScrollView>
        <Card>
          <Card.Title>List Machine</Card.Title>
          <Card.Divider />

          <Pressable
            onPress={() => setIsVisible(true)}
            style={[styles.button, styles.backMain]}
          >
            <Text style={[styles.text, styles.textLight]}>Create Machine</Text>
          </Pressable>

          {isLoading ? (
            <CustomTable {...customtableProps} />
          ) : (
            <LoadingSpinner />
          )}
        </Card>
      </ScrollView>

      <Dialog_m {...dialog_mProps} />
    </View>
  );
});

export default MachineScreen;
