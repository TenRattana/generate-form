import React, { useState, useCallback } from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import axios from "../../config/axios";
import { Card } from "@rneui/themed";
import { CustomTable, LoadingSpinner, Searchbars } from "../components";
import { useTheme, useToast, useRes } from "../../contexts";
import screenStyles from "../../styles/screens/screen";
import { useFocusEffect } from "@react-navigation/native";

const FormScreen = React.memo(({ navigation }) => {
  const [form, setForm] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
          const [formResponse] = await Promise.all([
            axios.post("Form_service.asmx/GetForms"),
          ]);
          setForm(formResponse.data.data ?? []);
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
      return () => {};
    }, [])
  );

  const handleAction = async (action, item) => {
    try {
      if (action === "changeIndex") {
        navigation.navigate("Create Form", { formId: item });
      } else if (action === "preIndex") {
        navigation.navigate("View Form", { formId: item });
      } else {
        if (action === "activeIndex") {
          await axios.post("Form_service.asmx/ChangeForm", {
            FormID: item,
          });
        } else if (action === "delIndex") {
          await axios.post("Form_service.asmx/DeleteForm", {
            FormID: item,
          });
        }

        const response = await axios.post("Form_service.asmx/GetForms");
        setForm(response.data.data || []);
      }
    } catch (error) {
      ShowMessages(
        error.message || "Error",
        error.response ? error.response.data.errors : ["Something went wrong!"],
        "error"
      );
    }
  };

  const handleNewForm = () => {
    navigation.navigate("Create Form");
  };

  const tableData = form.map((item) => {
    return [
      item.FormName,
      item.Description,
      item.IsActive,
      item.FormID,
      item.FormID,
      item.FormID,
      item.FormID,
      item.FormID,
    ];
  });

  const tableHead = [
    "Form Name",
    "Form Description",
    "Status ",
    "Change Status",
    "Change Form",
    "Copy Template",
    "Preview",
    "Delete",
  ];

  const actionIndex = [
    {
      activeIndex: 3,
      changeIndex: 4,
      copyIndex: 5,
      preIndex: 6,
      delIndex: 7,
    },
  ];

  const customtableProps = {
    Tabledata: tableData,
    Tablehead: tableHead,
    flexArr: [2, 4, 1, 1, 1, 1, 1, 1],
    actionIndex,
    handleAction,
    searchQuery,
  };

  return (
    <View style={styles.scrollView}>
      <ScrollView>
        <Card>
          <Card.Title>Forms</Card.Title>
          <Card.Divider />

          <Searchbars
            viewProps={
              <Pressable
                onPress={handleNewForm}
                style={[styles.button, styles.backMain]}
              >
                <Text style={[styles.text, styles.textLight]}>New Form</Text>
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
    </View>
  );
});

export default FormScreen;
