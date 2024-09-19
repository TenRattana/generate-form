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
  groupCheckListOptionName: Yup.string().required(
    "The group check list option name field is required."
  ),
  description: Yup.string().required("The description field is required."),
  displayOrder: Yup.number()
    .typeError("The display order field must be numeric.")
    .required("The display order field is required."),
});

const GroupCheckListOptionScreen = React.memo(() => {
  const [groupCheckListOption, setGroupCheckListOption] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [initialValues, setInitialValues] = useState({
    groupCheckListOptionId: "",
    groupCheckListOptionName: "",
    description: "",
    displayOrder: "",
  });
  const { colors, fonts, spacing } = useTheme();
  const { Toast } = useToast();
  const { responsive } = useRes();
  const styles = screenStyles({ colors, spacing, fonts, responsive });
  console.log("GroupCheckListOptionScreen");

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
          const [groupCheckListOptionResponse] = await Promise.all([
            axios.post(
              "GroupCheckListOption_service.asmx/GetGroupCheckListOptions"
            ),
          ]);
          setGroupCheckListOption(groupCheckListOptionResponse.data.data ?? []);
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
          groupCheckListOptionId: "",
          groupCheckListOptionName: "",
          description: "",
          displayOrder: "",
        });
        setIsEditing(false);
      };
    }, [])
  );

  const saveData = async (values) => {
    setIsLoadingButton(true);

    const data = {
      GCLOptionID: values.groupCheckListOptionId,
      GCLOptionName: values.groupCheckListOptionName,
      Description: values.description,
      DisplayOrder: values.displayOrder,
    };

    try {
      await axios.post(
        "GroupCheckListOption_service.asmx/SaveGroupCheckListOption",
        data
      );
      const response = await axios.post(
        "GroupCheckListOption_service.asmx/GetGroupCheckListOptions"
      );
      setGroupCheckListOption(response.data.data ?? []);
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
          "GroupCheckListOption_service.asmx/GetGroupCheckListOption",
          {
            GCLOptionID: item,
          }
        );
        const groupCheckListOptionData = response.data.data[0] ?? {};
        setInitialValues({
          groupCheckListOptionId: groupCheckListOptionData.GCLOptionID ?? "",
          groupCheckListOptionName:
            groupCheckListOptionData.GCLOptionName ?? "",
          description: groupCheckListOptionData.Description ?? "",
          displayOrder: groupCheckListOptionData.DisplayOrder ?? "",
        });
        setIsVisible(true);
        setIsEditing(true);
      } else {
        if (action === "activeIndex") {
          await axios.post(
            "GroupCheckListOption_service.asmx/ChangeGroupCheckListOption",
            {
              GCLOptionID: item,
            }
          );
        } else if (action === "delIndex") {
          await axios.post(
            "GroupCheckListOption_service.asmx/DeleteGroupCheckListOption",
            {
              GCLOptionID: item,
            }
          );
        }
        const response = await axios.post(
          "GroupCheckListOption_service.asmx/GetGroupCheckListOptions"
        );
        setGroupCheckListOption(response.data.data ?? []);
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
        groupCheckListOptionId: "",
        groupCheckListOptionName: "",
        description: "",
        displayOrder: "",
      });
      setIsEditing(false);
    }
  }, [isVisible]);

  const tableData = groupCheckListOption.map((item) => {
    return [
      item.GCLOptionName,
      item.Description,
      item.DisplayOrder,
      item.IsActive,
      item.GCLOptionID,
      item.GCLOptionID,
      item.GCLOptionID,
    ];
  });

  console.log(tableData);

  const tableHead = [
    "Group Option Name",
    "Description",
    "Display Order",
    "Status",
    "Change Status",
    "Edit",
    "Delete",
  ];

  const actionIndex = [{ activeIndex: 4, editIndex: 5, delIndex: 6 }];

  const customtableProps = {
    Tabledata: tableData,
    Tablehead: tableHead,
    flexArr: [3, 5, 1, 1, 1, 1, 1],
    actionIndex,
    handleAction,
    searchQuery,
  };

  return (
    <View style={styles.scrollView}>
      <ScrollView>
        <Card>
          <Card.Title>Create Group Option</Card.Title>
          <Card.Divider />

          <Searchbars
            viewProps={
              <Pressable
                onPress={() => setIsVisible(true)}
                style={[styles.button, styles.backMain]}
              >
                <Text style={[styles.text, styles.textLight]}>
                  Create Group Option
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
                setIsVisible(false);
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
                    placeholder="Enter Group Check List"
                    label="Group Check List Name"
                    handleChange={handleChange("groupCheckListOptionName")}
                    handleBlur={handleBlur("groupCheckListOptionName")}
                    value={values.groupCheckListOptionName}
                    error={
                      touched.groupCheckListOptionName &&
                      Boolean(errors.groupCheckListOptionName)
                    }
                    errorMessage={
                      touched.groupCheckListOptionName
                        ? errors.groupCheckListOptionName
                        : ""
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

                  <Inputs
                    placeholder="Enter Display Order"
                    label="Display Order"
                    handleChange={handleChange("displayOrder")}
                    handleBlur={handleBlur("displayOrder")}
                    value={values.displayOrder}
                    error={touched.displayOrder && Boolean(errors.displayOrder)}
                    errorMessage={
                      touched.displayOrder ? errors.displayOrder : ""
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

export default GroupCheckListOptionScreen;
