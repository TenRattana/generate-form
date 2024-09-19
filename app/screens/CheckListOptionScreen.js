import React, { useState, useCallback, useMemo } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme, useToast, useRes } from "../../contexts";
import { ScrollView, View, Pressable, Text } from "react-native";
import axios from "../../config/axios";
import { CustomTable, LoadingSpinner, Inputs, Searchbars } from "../components";
import { Card } from "@rneui/themed";
import { Portal, Switch, Dialog } from "react-native-paper";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import screenStyles from "../../styles/screens/screen";

const validationSchema = Yup.object().shape({
  checkListOptionName: Yup.string().required(
    "The check list option name field is required."
  ),
  isActive: Yup.boolean("The active field is required."),
});

const CheckListOptionScreen = React.memo(() => {
  const [checkListOption, setCheckListOption] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [initialValues, setInitialValues] = useState({
    checkListOptionId: "",
    checkListOptionName: "",
    isActive: true,
  });
  const { colors, fonts, spacing } = useTheme();
  const { Toast } = useToast();
  const { responsive } = useRes();
  const styles = screenStyles({ colors, spacing, fonts, responsive });
  console.log("checkListOptionScreen");

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
          const [checkListOptionResponse] = await Promise.all([
            axios.post("CheckListOption_service.asmx/GetCheckListOptions"),
          ]);
          setCheckListOption(checkListOptionResponse.data.data ?? []);
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
          checkListOptionId: "",
          checkListOptionName: "",
          isActive: true,
        });
        setIsEditing(false);
      };
    }, [])
  );

  const saveData = async (values) => {
    setIsLoadingButton(true);

    const data = {
      CLOptionID: values.checkListOptionId,
      CLOptionName: values.checkListOptionName,
      isActive: values.isActive,
    };

    try {
      await axios.post(
        "CheckListOption_service.asmx/SaveCheckListOption",
        data
      );
      const response = await axios.post(
        "CheckListOption_service.asmx/GetCheckListOptions"
      );
      setCheckListOption(response.data.data ?? []);
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
          "CheckListOption_service.asmx/GetCheckListOption",
          {
            CLOptionID: item,
          }
        );
        const checkListOptionData = response.data.data[0] ?? {};
        setInitialValues({
          checkListOptionId: checkListOptionData.CLOptionID ?? "",
          checkListOptionName: checkListOptionData.CLOptionName ?? "",
          isActive: Boolean(checkListOptionData.IsActive),
        });
        setIsVisible(true);
        setIsEditing(true);
      } else {
        if (action === "activeIndex") {
          await axios.post(
            "CheckListOption_service.asmx/ChangeCheckListOption",
            {
              CLOptionID: item,
            }
          );
        } else if (action === "delIndex") {
          await axios.post(
            "CheckListOption_service.asmx/DeleteCheckListOption",
            {
              CLOptionID: item,
            }
          );
        }

        const response = await axios.post(
          "CheckListOption_service.asmx/GetCheckListOptions"
        );
        setCheckListOption(response.data.data ?? []);
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
        checkListOptionId: "",
        checkListOptionName: "",
        isActive: true,
      });
      setIsEditing(false);
    }
  }, [isVisible]);

  const tableData = checkListOption.map((item) => {
    return [item.CLOptionName, item.IsActive, item.CLOptionID, item.CLOptionID];
  });

  const tableHead = [
    "Check List Option Name",
    "Change Status",
    "Edit",
    "Delete",
  ];

  const actionIndex = [{ activeIndex: 2, editIndex: 3, delIndex: 4 }];

  const customtableProps = {
    Tabledata: tableData,
    Tablehead: tableHead,
    flexArr: [5, 1, 1, 1],
    actionIndex,
    handleAction,
    searchQuery,
  };

  return (
    <View style={styles.scrollView}>
      <ScrollView>
        <Card>
          <Card.Title>Create Option</Card.Title>
          <Card.Divider />

          <Searchbars
            viewProps={
              <Pressable
                onPress={() => setIsVisible(true)}
                style={[styles.button, styles.backMain]}
              >
                <Text style={[styles.text, styles.textLight]}>
                  Create Check List Option
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
                ? "Edit the details of the group check list."
                : "Enter the details for the new group check list."}
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
                    placeholder="Enter Check List Option"
                    label="Machine Check List Option"
                    handleChange={handleChange("checkListOptionName")}
                    handleBlur={handleBlur("checkListOptionName")}
                    value={values.checkListOptionName}
                    error={
                      touched.checkListOptionName &&
                      Boolean(errors.checkListOptionName)
                    }
                    errorMessage={
                      touched.checkListOptionName
                        ? errors.checkListOptionName
                        : ""
                    }
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

export default CheckListOptionScreen;
