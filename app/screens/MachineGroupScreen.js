import React, { useState, useMemo, useEffect } from "react";
import { useTheme, useToast, useRes } from "../../contexts";
import { ScrollView, View, Pressable, Text } from "react-native";
import axios from "../../config/axios";
import { CustomTable, LoadingSpinner, Inputs, Searchbars } from "../components";
import { Card } from "@rneui/themed";
import { Portal, Switch, Dialog } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import screenStyles from "../../styles/screens/screen";

const validationSchema = Yup.object().shape({
  machineGroupName: Yup.string().required(
    "The machine group name field is required."
  ),
  description: Yup.string().required("The description field is required."),
  isActive: Yup.boolean("The active field is required."),
});

const MachineGroupScreen = React.memo(() => {
  const [machineGroup, setMachineGroup] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [initialValues, setInitialValues] = useState({
    machineGroupId: "",
    machineGroupName: "",
    description: "",
    isActive: true,
  });

  const { colors, fonts, spacing } = useTheme();
  const { Toast } = useToast();
  const { responsive } = useRes();
  const styles = screenStyles({ colors, spacing, fonts, responsive });
  console.log("MachineGroup");

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
  }, []);

  const saveData = async (values) => {
    setIsLoadingButton(true);

    const data = {
      MGroupID: values.machineGroupId,
      MGroupName: values.machineGroupName,
      Description: values.description,
      isActive: values.isActive,
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
          isActive: Boolean(machineGroupData.IsActive),
        });
        setIsEditing(true);
        setIsVisible(true);
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
        description: "",
        isActive: true,
      });
      setIsVisible(false);
      setIsEditing(false);
    }
  }, [isVisible]);

  const tableData = machineGroup.map((item) => [
    item.MGroupName,
    item.Description,
    item.IsActive,
    item.MGroupID,
    item.MGroupID,
  ]);

  const tableHead = [
    "Machine Group Name",
    "Description",
    "Change Status",
    "Edit",
    "Delete",
  ];

  const actionIndex = [
    {
      editIndex: 3,
      delIndex: 4,
    },
  ];

  const customtableProps = {
    Tabledata: tableData,
    Tablehead: tableHead,
    flexArr: [2, 3, 1, 1, 1],
    actionIndex,
    handleAction,
    searchQuery,
  };

  return (
    <View style={styles.scrollView}>
      <ScrollView>
        <Card>
          <Card.Title>List Group Machine</Card.Title>
          <Card.Divider />

          <Searchbars
            viewProps={
              <Pressable
                onPress={() => setIsVisible(true)}
                style={[styles.button, styles.backMain]}
              >
                <Text style={[styles.text, styles.textLight]}>
                  Create Group Machine
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
                ? "Edit the details of the machine group."
                : "Enter the details for the new machine group."}
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
                  <Inputs
                    placeholder="Enter Machine Group Name"
                    label="Machine Group Name"
                    handleChange={handleChange("machineGroupName")}
                    handleBlur={handleBlur("machineGroupName")}
                    value={values.machineGroupName}
                    error={
                      touched.machineGroupName &&
                      Boolean(errors.machineGroupName)
                    }
                    errorMessage={
                      touched.machineGroupName ? errors.machineGroupName : ""
                    }
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

export default MachineGroupScreen;
