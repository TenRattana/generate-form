import React, { useState, useEffect } from "react";
import { useTheme, useToast, useRes } from "../../contexts";
import { ScrollView, View, Pressable, Text } from "react-native";
import axios from "../../config/axios";
import {
  CustomTable,
  CustomDropdown,
  LoadingSpinner,
  Inputs,
  Searchbars,
} from "../components";
import { Card } from "@rneui/themed";
import { Portal, Switch, Dialog } from "react-native-paper";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import screenStyles from "../../styles/screens/screen";

const validationSchema = Yup.object().shape({
  machineGroupId: Yup.string().required("The machine group field is required."),
  machineName: Yup.string().required("The machine name field is required."),
  description: Yup.string().required("The description field is required."),
  isActive: Yup.boolean("The active field is required."),
});

const MachineScreen = React.memo(() => {
  const [machine, setMachine] = useState([]);
  const [machineGroup, setMachineGroup] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [initialValues, setInitialValues] = useState({
    machineId: "",
    machineGroupId: "",
    machineName: "",
    description: "",
    isActive: true,
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

  useEffect(() => {
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
  }, []);

  const saveData = async (values) => {
    setIsLoadingButton(true);

    const data = {
      MachineID: values.machineId,
      MGroupID: values.machineGroupId,
      MachineName: values.machineName,
      Description: values.description,
      isActive: values.isActive,
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
          isActive: Boolean(machineData.IsActive),
        });
        setIsEditing(true);
        setIsVisible(true);
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

  const tableData = machine.map((item) => {
    return [
      machineGroup.find((group) => group.MGroupID === item.MGroupID)
        ?.MGroupName || "",
      item.MachineName,
      item.Description,
      item.IsActive,
      item.MachineID,
      item.MachineID,
    ];
  });

  const tableHead = [
    "Machine Group Name",
    "Machine Name",
    "Description",
    "Change Status",
    "Edit",
    "Delete",
  ];

  const actionIndex = [
    {
      editIndex: 4,
      delIndex: 5,
    },
  ];

  const dropmachineGroup = Array.isArray(machineGroup)
    ? machineGroup.filter(
        (v) => v.IsActive || v.MGroupID === initialValues.machineGroupId
      )
    : [];

  const customtableProps = {
    Tabledata: tableData,
    Tablehead: tableHead,
    flexArr: [3, 3, 3, 1, 1, 1],
    actionIndex,
    handleAction,
    searchQuery,
  };

  return (
    <View style={styles.scrollView}>
      <ScrollView>
        <Card>
          <Card.Title>List Machine</Card.Title>
          <Card.Divider />

          <Searchbars
            viewProps={
              <Pressable
                onPress={() => {
                  setInitialValues({
                    machineId: "",
                    machineGroupId: "",
                    machineName: "",
                    description: "",
                    isActive: true,
                  });
                  setIsEditing(false);
                  setIsVisible(true);
                }}
                style={[styles.button, styles.backMain]}
              >
                <Text style={[styles.text, styles.textLight]}>
                  Create Machine
                </Text>
              </Pressable>
            }
            searchQuery={searchQuery}
            handleChange={setSearchQuery}
          />

          {isLoading ? (
            <CustomTable {...customtableProps} />
          ) : (
            <LoadingSpinner />
          )}
        </Card>
      </ScrollView>

      <Portal>
        <Dialog
          visible={isVisible}
          onDismiss={() => setIsVisible(false)}
          style={styles.containerDialog}
          contentStyle={styles.containerDialog}
        >
          <Dialog.Title style={{ paddingLeft: 8 }}>
            {isEditing ? "Edit" : "Create"}
          </Dialog.Title>
          <Dialog.Content>
            <Text
              style={[styles.textDark, { marginBottom: 10, paddingLeft: 10 }]}
            >
              {isEditing
                ? "Edit the details of the machine."
                : "Enter the details for the new machine."}
            </Text>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              validateOnBlur={false}
              validateOnChange={true}
              onSubmit={(values) => {
                saveData(values);
              }}
            >
              {({
                handleChange,
                handleBlur,
                setFieldValue,
                values,
                errors,
                touched,
                handleSubmit,
                isValid,
                dirty,
              }) => (
                <View>
                  <Field
                    name="machineGroupId"
                    component={({ field, form }) => (
                      <CustomDropdown
                        title="Machine Group"
                        labels="MGroupName"
                        values="MGroupID"
                        data={
                          !isEditing
                            ? machineGroup.filter((v) => v.IsActive)
                            : dropmachineGroup
                        }
                        selectedValue={values.machineGroupId}
                        onValueChange={(value) => {
                          setFieldValue(field.name, value);
                          form.setTouched({
                            ...form.touched,
                            [field.name]: true,
                          });
                        }}
                        lefticon={"application-settings"}
                      />
                    )}
                  />

                  {touched.machineGroupId && errors.machineGroupId && (
                    <Text
                      style={[
                        styles.text,
                        styles.textError,
                        { marginLeft: spacing.xs, top: -spacing.xxs },
                      ]}
                    >
                      {errors.machineGroupId}
                    </Text>
                  )}

                  <Inputs
                    placeholder="Enter Machine Name"
                    label="Machine Name"
                    handleChange={handleChange("machineName")}
                    handleBlur={handleBlur("machineName")}
                    value={values.machineName}
                    error={touched.machineName && Boolean(errors.machineName)}
                    errorMessage={touched.machineName ? errors.machineName : ""}
                  />

                  <Inputs
                    placeholder="Enter Description"
                    label="Description"
                    handleChange={handleChange("description")}
                    handleBlur={handleBlur("description")}
                    value={values.description}
                    error={touched.description && Boolean(errors.description)}
                    errorMessage={touched.description ? errors.description : ""}
                  />

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginVertical: 10,
                    }}
                  >
                    <Text
                      style={[
                        styles.text,
                        styles.textDark,
                        { marginHorizontal: 12 },
                      ]}
                    >
                      Status: {values.isActive ? "Active" : "Inactive"}
                    </Text>

                    <Switch
                      style={{ transform: [{ scale: 1.1 }], top: 2 }}
                      color={values.isActive ? colors.succeass : colors.disable}
                      value={values.isActive}
                      onValueChange={() =>
                        setFieldValue("isActive", !values.isActive)
                      }
                    />
                  </View>

                  <View style={styles.containerFlexStyle}>
                    <Pressable
                      onPress={handleSubmit}
                      style={[
                        styles.button,
                        isValid && dirty ? styles.backMain : styles.backDis,
                      ]}
                      disabled={!isValid || !dirty}
                    >
                      <Text
                        style={[styles.textBold, styles.text, styles.textLight]}
                      >
                        Save
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() => setIsVisible(false)}
                      style={[styles.button, styles.backMain]}
                    >
                      <Text
                        style={[styles.textBold, styles.text, styles.textLight]}
                      >
                        Cancel
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </Formik>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </View>
  );
});

export default MachineScreen;
