import React, { useState, useCallback, useMemo } from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import axios from "../../config/axios";
import { Card } from "@rneui/themed";
import { CustomTable, LoadingSpinner, Dialog_mfm } from "../components";
import { useTheme, useToast, useRes } from "../../contexts";
import screenStyles from "../../styles/screens/screen";
import { useFocusEffect } from "@react-navigation/native";

const MatchFormMachineScreen = React.memo(({ navigation }) => {
  const [form, setForm] = useState([]);
  const [machine, setMachine] = useState([]);
  const [matchForm, setMatchForm] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [resetDropdown, setResetDropdown] = useState(false);
  const [initialValues, setInitialValues] = useState({
    machineId: "",
    formId: "",
  });
  const { colors, fonts, spacing } = useTheme();
  const { Toast } = useToast();
  const { responsive } = useRes();
  const styles = screenStyles({ colors, spacing, fonts, responsive });
  console.log("Forms");

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
          const [machineResponse, formResponse, matchFormResponse] =
            await Promise.all([
              axios.post("Machine_service.asmx/GetMachines"),
              axios.post("Form_service.asmx/GetForms"),
              axios.post("MatchFormMachine_service.asmx/GetMatchFormMachines"),
            ]);
          setMachine(machineResponse.data.data ?? []);
          setForm(formResponse.data.data ?? []);
          setMatchForm(matchFormResponse.data.data ?? []);
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
          formId: "",
        });
        setIsEditing(false);
      };
    }, [])
  );

  const saveData = async (values) => {
    setIsLoadingButton(true);

    const data = {
      MachineID: values.machineId,
      FormID: values.formId,
    };

    try {
      await axios.post("SaveForm", data);
      const response = await axios.post("GetMatchFormMachines");
      setMatchForm(response.data.data ?? []);
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
        const response = await axios.post("GetMatchFormMachine", {
          MachineID: item,
        });
        const machineData = response.data.data[0] ?? {};
        setInitialValues({
          machineId: machineData.MachineID ?? "",
          formId: machineData.FormID ?? "",
        });

        setIsVisible(true);
        setIsEditing(true);
      } else {
        if (action === "delIndex") {
          await axios.post("DeleteMatchForm", {
            FormID: item.form,
            MachineID: item.machine,
          });
          const response = await axios.post("GetMatchFormMachines");
          setMatchForm(response.data.data || []);
        } else if (action === "changeIndex") {
          navigation.navigate("Create Form", { machineId: item });
        } else if (action === "preIndex") {
          navigation.navigate("View Form", { machineId: item });
        }
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
        formId: "",
      });
      setIsEditing(false);
      setResetDropdown(true);
      setTimeout(() => setResetDropdown(false), 0);
    }
  }, [isVisible]);

  const tableData = matchForm.map((item) => {
    return [
      item.MachineName,
      item.FormName,
      item.MachineID,
      item.MachineID,
      item.MachineID,
      item.MachineID,
      item.FormID,
    ];
  });

  const tableHead = [
    "Machine Name",
    "Form Name",
    "Change Form",
    "Copy Template",
    "Preview",
    "Edit",
    "Delete",
  ];

  let dropmachine = [];

  dropmachine =
    Array.isArray(machine) && machine.length > 0
      ? machine.filter((v) => v.IsActive)
      : dropmachine;

  let dropform = [];

  dropform =
    Array.isArray(form) && form.length > 0
      ? form.filter((v) => v.IsActive)
      : dropform;

  return (
    <View style={styles.scrollView}>
      <ScrollView>
        <Card>
          <Card.Title>Create Match Machine & Form</Card.Title>
          <Card.Divider />

          <Pressable
            onPress={() => setIsVisible(true)}
            style={[styles.button, styles.backMain]}
          >
            <Text style={[styles.text, styles.textLight]}>
              Create Match Machine & Form
            </Text>
          </Pressable>

          {isLoading ? (
            <CustomTable
              Tabledata={tableData}
              Tablehead={tableHead}
              flexArr={[2, 2, 1, 1, 1, 1, 1]}
              actionIndex={[
                {
                  changeIndex: 2,
                  copyIndex: 3,
                  preIndex: 4,
                  editIndex: 5,
                  delIndex: 6,
                },
              ]}
              handleAction={handleAction}
            />
          ) : (
            <LoadingSpinner />
          )}
        </Card>
      </ScrollView>

      <Dialog_mfm
        dropmachine={dropmachine}
        dropform={dropform}
        style={{ styles, colors, spacing, responsive, fonts }}
        isVisible={isVisible}
        isEditing={isEditing}
        initialValues={initialValues}
        saveData={saveData}
        setIsVisible={setIsVisible}
        resetDropdown={resetDropdown}
      />
    </View>
  );
});

export default MatchFormMachineScreen;
