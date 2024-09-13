import React, { useState, useCallback } from "react";
import { ScrollView, Text, View } from "react-native";
import axios from "../../config/axios";
import { Button, Card } from "@rneui/themed";
import { CustomTable } from "../components";
import validator from "validator";
import { useTheme, useToast, useRes } from "../contexts";
import screenStyles from "../styles/screens/screen";
import { useFocusEffect } from "@react-navigation/native";

const FormScreen = React.memo(({ navigation }) => {
  const [form, setForm] = useState([]);
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
        } catch (error) {
          ShowMessages(error.message, error.response?.data?.errors, "error");
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
      console.error("Error fetching question data:", error);
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
    "",
    "Change Status",
    "Change Form",
    "Copy Template",
    "Preview",
    "Delete",
  ];

  return (
    <View style={styles.scrollView}>
      <ScrollView>
        <Card>
          <Card.Title>Forms</Card.Title>
          <Card.Divider />
          <Button
            title="New Form"
            type="outline"
            titleStyle={styles.text}
            containerStyle={{
              width: 300,
              marginHorizontal: "1%",
              marginTop: "1%",
            }}
            onPress={handleNewForm}
          />

          <CustomTable
            Tabledata={tableData}
            Tablehead={tableHead}
            flexArr={[2, 4, 1, 1, 1, 1, 1, 1]}
            actionIndex={[
              {
                activeIndex: 3,
                changeIndex: 4,
                copyIndex: 5,
                preIndex: 6,
                delIndex: 7,
              },
            ]}
            handleAction={handleAction}
          />
        </Card>
      </ScrollView>
    </View>
  );
});

export default FormScreen;
