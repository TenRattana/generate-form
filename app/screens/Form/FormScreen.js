import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "../../../config/axios";
import { Button, Card, Input } from "@rneui/themed";
import { colors, spacing, fonts } from "../../../theme";
import { CustomTable, useResponsive } from "../../components";
import CreateFormScreen from "./CreateFormScreen";
import AntDesign from "@expo/vector-icons/AntDesign";

const Forms = ({ navigation }) => {
  const [form, setForm] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const responsive = useResponsive();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [formResponse] = await Promise.all([axios.post("GetForms")]);
        setForm(formResponse.data.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleAction = async (action, item) => {
    setIsLoading(true);
    try {
      if (action === "edit") {
        navigation.navigate("Create Form", { formIdforEdit: item });
      } else if (action === "del") {
        const response1 = await axios.post("DeleteMatchList", {
          FormID: item,
        });
        const response = await axios.post("GetForms");
        setForm(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching question data:", error);
    }
    setIsLoading(false);
  };

  const handleNewForm = () => {
    navigation.navigate("Create Form");
  };
  const tableData = form.map((item) => {
    return [item.FormName, item.FormID, item.FormID, item.FormID];
  });

  const tableHead = ["Form Name", "Copy Template", "Edit", "Delete"];

  const styles = StyleSheet.create({
    scrollView: {
      flex: 1,
    },
    text: {
      fontSize:
        responsive === "small"
          ? fonts.xsm
          : responsive === "medium"
          ? fonts.sm
          : fonts.xsm,
      color: colors.text,
    },
    buttonContainer: {
      justifyContent: "flex-start",
      marginLeft: 30,
      width: responsive === "small" ? "90%" : 150,
    },
    containerButton: {
      width: responsive === "small" ? "90%" : 300,
      marginVertical: "1%",
      marginHorizontal: "2%",
    },
    containerInput: {
      backgroundColor: "darkgray",
      marginVertical: spacing.md,
    },
    errorText: {
      fontSize:
        responsive === "small"
          ? fonts.xsm
          : responsive === "medium"
          ? fonts.sm
          : fonts.xsm,
      marginLeft: spacing.xs,
      top: -spacing.xxs,
      color: colors.danger,
    },
    button: {
      padding: 10,
      backgroundColor: colors.palette.background2,
      justifyContent: responsive === "small" ? "center" : "flex-start",
      flexDirection: "row",
      paddingLeft: 10,
      width: "100%",
    },
  });

  return (
    <ScrollView style={styles.scrollView}>
      <Card>
        <Card.Title>List Form</Card.Title>
        <Card.Divider />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleNewForm}>
            <AntDesign name="copy1" size={20} color={colors.palette.danger} />
            <Text style={[styles.text, { color: colors.palette.light }]}>
              New Form
            </Text>
          </TouchableOpacity>
        </View>

        <CustomTable
          Tabledata={tableData}
          Tablehead={tableHead}
          flexArr={[4, 1, 1, 1]}
          copyIndex={1}
          editIndex={2}
          delIndex={3}
          TextAlie={["left"]}
          handleAction={handleAction}
        />
      </Card>
    </ScrollView>
  );
};

export default Forms;
