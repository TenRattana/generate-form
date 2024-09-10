import React, { useState, useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
import axios from "../../config/axios";
import { Button, Card, Input } from "@rneui/themed";
import { CustomTable, CustomDropdown } from "../components";
import validator from "validator";
import { useTheme, useToast, useRes } from "../contexts";
import screenStyles from "../styles/screens/screen";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [formResponse] = await Promise.all([axios.post("GetForms")]);
        setForm(formResponse.data.data ?? []);
      } catch (error) {
        ShowMessages(error.message, error.response.data.errors, "error");
      }
    };

    fetchData();
  }, []);

  const handleAction = async (action, item) => {
    try {
      if (action === "editIndex") {
        const response = await axios.post("GetMatchForm", {
          FormID: item.form,
        });
        const machineData = response.data.data[0] ?? {};
        setFormState({
          machineId: machineData.MachineID ?? "",
          formId: machineData.FormID ?? "",
        });
        setIsEditing(true);
      } else if (action === "delIndex") {
        const response1 = await axios.post("DeleteMatchForm", {
          FormID: item.form,
          MachineID: item.machine,
        });
        const response = await axios.post("GetMatchFormMachines");
        setMatchForm(response.data.data || []);
      } else if (action === "changeIndex") {
        navigation.navigate("Create Form", { formIdforEdit: item });
      } else if (action === "preIndex") {
        navigation.navigate("View Form", { formId: item });
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
      item.FormID,
      item.FormID,
      item.FormID,
      item.FormID,
    ];
  });

  const tableHead = [
    "Form Name",
    "Form Description",
    "Change Form",
    "Copy Template",
    "Preview",
    "Delete",
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
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
          flexArr={[2, 2, 1, 1, 1, 1, 1]}
          actionIndex={[
            {
              changeIndex: 2,
              copyIndex: 3,
              preIndex: 4,
              delIndex: 5,
            },
          ]}
          handleAction={handleAction}
        />
      </Card>
    </ScrollView>
  );
});

export default FormScreen;
