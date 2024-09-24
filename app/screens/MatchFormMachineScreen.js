import React, { useState, useEffect } from "react";
import { useTheme, useToast, useRes } from "../../contexts";
import { ScrollView, View, Pressable, Text } from "react-native";
import axios from "../../config/axios";
import {
  CustomTable,
  CustomDropdown,
  LoadingSpinner,
  Searchbars,
} from "../components";
import { Card } from "@rneui/themed";
import { Portal, Dialog } from "react-native-paper";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import screenStyles from "../../styles/screens/screen";

const validationSchema = Yup.object().shape({
  machineId: Yup.string().required("This machine field is required"),
  formId: Yup.string().required("This form field is required"),
});

const MatchFormMachineScreen = React.memo(({ navigation }) => {
  const [forms, setForm] = useState([]);
  const [machine, setMachine] = useState([]);
  const [matchForm, setMatchForm] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
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

  useEffect(() => {
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
  }, []);

  const saveData = async (values) => {
    setIsLoadingButton(true);

    const data = {
      MachineID: values.machineId,
      FormID: values.formId,
    };

    try {
      await axios.post(
        "MatchFormMachine_service.asmx/SaveMatchFormMachine",
        data
      );
      const response = await axios.post(
        "MatchFormMachine_service.asmx/GetMatchFormMachines"
      );
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
      if (action === "changeIndex") {
        navigation.navigate("Create Form", { machineId: item });
      } else if (action === "preIndex") {
        navigation.navigate("View Form", { machineId: item });
      } else if (action === "copyIndex") {
        navigation.navigate("Create Form", {
          machineId: item,
          action: "copy",
        });
      } else if (action === "editIndex") {
        const response = await axios.post(
          "MatchFormMachine_service.asmx/GetMatchFormMachine",
          {
            MachineID: item,
          }
        );
        const machineData = response.data.data[0] ?? {};
        setInitialValues({
          machineId: machineData.MachineID ?? "",
          formId: machineData.FormID ?? "",
        });

        setIsVisible(true);
        setIsEditing(true);
      } else {
        if (action === "delIndex") {
          const data = {
            MachineID: item,
          };
          console.log(data);

          await axios.post(
            "MatchFormMachine_service.asmx/DeleteMatchFormMachine",
            data
          );
          const response = await axios.post(
            "MatchFormMachine_service.asmx/GetMatchFormMachines"
          );
          setMatchForm(response.data.data || []);
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

  const tableData = matchForm.map((item) => {
    return [
      item.MachineName,
      item.FormName,
      item.MachineID,
      item.MachineID,
      item.MachineID,
      item.MachineID,
      item.MachineID,
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

  const dropmachine = Array.isArray(machine)
    ? machine.filter((v) => v.IsActive)
    : [];

  const dropform = Array.isArray(forms) ? forms.filter((v) => v.IsActive) : [];

  const actionIndex = [
    {
      changeIndex: 2,
      copyIndex: 3,
      preIndex: 4,
      editIndex: 5,
      delIndex: 6,
    },
  ];

  const customtableProps = {
    Tabledata: tableData,
    Tablehead: tableHead,
    flexArr: [2, 2, 1, 1, 1, 1, 1],
    actionIndex,
    handleAction,
    searchQuery,
  };

  return (
    <View style={styles.scrollView}>
      <ScrollView>
        <Card>
          <Card.Title>Create Match Machine & Form</Card.Title>
          <Card.Divider />

          <Searchbars
            viewProps={
              <Pressable
                onPress={() => {
                  setInitialValues({
                    machineId: "",
                    formId: "",
                  });
                  setIsEditing(false);
                  setIsVisible(true);
                }}
                style={[styles.button, styles.backMain]}
              >
                <Text style={[styles.text, styles.textLight]}>
                  Create Match Machine & Form
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
                ? "Edit the details of the match machine and form."
                : "Enter the details for the new match machine and form."}
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
                    name="machineId"
                    component={({ field, form }) => (
                      <CustomDropdown
                        title="Machine"
                        labels="MachineName"
                        values="MachineID"
                        data={isEditing ? machine : dropmachine}
                        selectedValue={values.machineId}
                        onValueChange={(value) => {
                          setFieldValue(field.name, value);
                          form.setTouched({
                            ...form.touched,
                            [field.name]: true,
                          });
                        }}
                      />
                    )}
                  />

                  {touched.machineId && errors.machineId && (
                    <Text
                      style={[
                        styles.text,
                        styles.textError,
                        { marginLeft: spacing.xs, top: -spacing.xxs },
                      ]}
                    >
                      {errors.machineId}
                    </Text>
                  )}

                  <Field
                    name="formId"
                    component={({ field, form }) => (
                      <CustomDropdown
                        title="Form"
                        labels="FormName"
                        values="FormID"
                        data={isEditing ? forms : dropform}
                        selectedValue={values.formId}
                        onValueChange={(value) => {
                          setFieldValue(field.name, value);
                          form.setTouched({
                            ...form.touched,
                            [field.name]: true,
                          });
                        }}
                      />
                    )}
                  />

                  {touched.formId && errors.formId ? (
                    <Text
                      style={{
                        color: "red",
                        marginVertical: 10,
                        left: 10,
                        top: -10,
                      }}
                    >
                      {errors.formId}
                    </Text>
                  ) : null}

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

export default MatchFormMachineScreen;
