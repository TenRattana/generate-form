import React, { useState, useEffect } from "react";
import { useTheme, useToast, useRes } from "../../contexts";
import { ScrollView, View, Pressable, Text } from "react-native";
import axios from "../../config/axios";
import {
  CustomTable,
  CustomDropdown,
  CustomDropdownMulti,
  LoadingSpinner,
  Searchbars,
} from "../components";
import { Card } from "@rneui/themed";
import { Portal, Switch, Dialog } from "react-native-paper";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import screenStyles from "../../styles/screens/screen";

const validationSchema = Yup.object().shape({
  groupCheckListOptionId: Yup.string().required(
    "This group check list field is required"
  ),
  checkListOptionId: Yup.array()
    .of(Yup.string())
    .min(1, "The check list option filed least one option must be selected"),
  isActive: Yup.boolean("The active field is required."),
});

const MatchCheckListOptionScreen = React.memo(() => {
  const [checkListOption, setCheckListOption] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [groupCheckListOption, setGroupCheckListOption] = useState([]);
  const [matchCheckListOption, setMatchCheckListOption] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [initialValues, setInitialValues] = useState({
    matchCheckListOptionId: "",
    checkListOptionId: [],
    groupCheckListOptionId: "",
    isActive: true,
  });
  const { colors, fonts, spacing } = useTheme();
  const { Toast } = useToast();
  const { responsive } = useRes();
  const styles = screenStyles({ colors, spacing, fonts, responsive });
  console.log("MatchCheckListOptionScreen");

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
        const [
          checkListOptionResponse,
          groupCheckListOptionResponse,
          matchCheckListOptionResponse,
        ] = await Promise.all([
          axios.post("CheckListOption_service.asmx/GetCheckListOptions"),
          axios.post(
            "GroupCheckListOption_service.asmx/GetGroupCheckListOptions"
          ),
          axios.post(
            "MatchCheckListOption_service.asmx/GetMatchCheckListOptions"
          ),
        ]);
        setCheckListOption(checkListOptionResponse.data.data ?? []);
        setGroupCheckListOption(groupCheckListOptionResponse.data.data ?? []);
        setMatchCheckListOption(matchCheckListOptionResponse.data.data ?? []);
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
      MCLOptionID: values.matchCheckListOptionId,
      GCLOptionID: values.groupCheckListOptionId,
      CLOptionID: JSON.stringify(values.checkListOptionId),
      isActive: values.isActive,
    };

    try {
      await axios.post(
        "MatchCheckListOption_service.asmx/SaveMatchCheckListOption",
        data
      );
      const response = await axios.post(
        "MatchCheckListOption_service.asmx/GetMatchCheckListOptions"
      );
      setMatchCheckListOption(response.data.data ?? []);
      setIsVisible(!response.data.status);
    } catch (error) {
      ShowMessages(
        error.message || "Error",
        error.response ? error.response.data.errors : ["Something wrong!"],
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
          "MatchCheckListOption_service.asmx/GetMatchCheckListOption",
          {
            MCLOptionID: item,
          }
        );
        const matchCheckListOption = response.data.data[0] ?? {};

        let option = [];
        if (matchCheckListOption && matchCheckListOption.CheckListOptions) {
          option = matchCheckListOption.CheckListOptions.map(
            (v) => v.CLOptionID
          );
        }
        setInitialValues({
          matchCheckListOptionId: matchCheckListOption.MCLOptionID ?? "",
          groupCheckListOptionId: matchCheckListOption.GCLOptionID ?? "",
          checkListOptionId: option,
          isActive: Boolean(matchCheckListOption.IsActive),
        });

        setIsVisible(true);
        setIsEditing(true);
      } else {
        if (action === "activeIndex") {
          await axios.post(
            "MatchCheckListOption_service.asmx/ChangeMatchCheckListOption",
            {
              MCLOptionID: item,
            }
          );
        } else if (action === "delIndex") {
          await axios.post(
            "MatchCheckListOption_service.asmx/DeleteMatchCheckListOption",
            {
              MCLOptionID: item,
            }
          );
        }

        const matchCheckListData = await axios.post(
          "MatchCheckListOption_service.asmx/GetMatchCheckListOptions"
        );
        setMatchCheckListOption(matchCheckListData.data.data || []);
      }
    } catch (error) {
      ShowMessages(
        error.message || "Error",
        error.response ? error.response.data.errors : ["Something went wrong!"],
        "error"
      );
    }
  };

  const tableData = matchCheckListOption.flatMap((item) =>
    item.CheckListOptions.map((option) => {
      const matchedOption = checkListOption.find(
        (group) => group.CLOptionID === option.CLOptionID
      );
      return [
        item.GCLOptionName,
        matchedOption?.CLOptionName,
        item.IsActive,
        item.MCLOptionID,
        item.MCLOptionID,
      ];
    })
  );

  const tableHead = [
    "Group Name",
    "Option Name",
    "Change Status",
    "Edit",
    "Delete",
  ];

  const dropcheckListOption = Array.isArray(checkListOption)
    ? checkListOption.filter(
        (v) => v.IsActive || v.CLOptionID === initialValues.checkListOptionId
      )
    : [];

  const dropgroupCheckListOption = Array.isArray(groupCheckListOption)
    ? groupCheckListOption.filter(
        (v) =>
          v.IsActive || v.GCLOptionID === initialValues.groupCheckListOptionId
      )
    : [];

  const actionIndex = [
    {
      editIndex: 3,
      delIndex: 4,
    },
  ];

  const customtableProps = {
    Tabledata: tableData,
    Tablehead: tableHead,
    flexArr: [3, 4, 1, 1, 1],
    actionIndex,
    handleAction,
    searchQuery,
  };

  return (
    <View style={styles.scrollView}>
      <ScrollView>
        <Card>
          <Card.Title>Create Match Group & Option</Card.Title>
          <Card.Divider />

          <Searchbars
            viewProps={
              <Pressable
                onPress={() => {
                  setInitialValues({
                    matchCheckListOptionId: "",
                    checkListOptionId: [],
                    groupCheckListOptionId: "",
                    isActive: true,
                  });
                  setIsEditing(false);
                  setIsVisible(true);
                }}
                style={[styles.button, styles.backMain]}
              >
                <Text style={[styles.text, styles.textLight]}>
                  Create Match Group & Option
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
                    name="groupCheckListOptionId"
                    component={({ field, form }) => (
                      <CustomDropdown
                        title="Group Check List Option"
                        labels="GCLOptionName"
                        values="GCLOptionID"
                        data={
                          !isEditing
                            ? groupCheckListOption.filter((v) => v.IsActive)
                            : dropgroupCheckListOption
                        }
                        selectedValue={values.groupCheckListOptionId}
                        onValueChange={(value) => {
                          setFieldValue(field.name, value);
                          form.setTouched({
                            ...form.touched,
                            [field.name]: true,
                          });
                        }}
                        lefticon={"format-list-group"}
                      />
                    )}
                  />

                  {touched.groupCheckListOptionId &&
                  errors.groupCheckListOptionId ? (
                    <Text
                      style={{
                        color: "red",
                        marginVertical: 10,
                        left: 10,
                        top: -10,
                      }}
                    >
                      {errors.groupCheckListOptionId}
                    </Text>
                  ) : null}

                  <Field
                    name="checkListOptionId"
                    component={({ field, form }) => (
                      <CustomDropdownMulti
                        title="Check List Option"
                        labels="CLOptionName"
                        values="CLOptionID"
                        data={
                          !isEditing
                            ? checkListOption.filter((v) => v.IsActive)
                            : dropcheckListOption
                        }
                        selectedValue={values.checkListOptionId || []}
                        onValueChange={(value) => {
                          setFieldValue(field.name, value);
                          form.setTouched({
                            ...form.touched,
                            [field.name]: true,
                          });
                        }}
                        lefticon={"table-column-plus-after"}
                      />
                    )}
                  />
                  {console.log(values)}
                  {touched.checkListOptionId && errors.checkListOptionId ? (
                    <Text
                      style={{
                        color: "red",
                        marginVertical: 10,
                        left: 10,
                        top: -10,
                      }}
                    >
                      {errors.checkListOptionId}
                    </Text>
                  ) : null}

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

export default MatchCheckListOptionScreen;
