import { StyleSheet, Text, View } from "react-native";
import React, { useState, useMemo, useContext } from "react";
import axios from "../../config/axios";
import { ThemeContext, ToastContext } from "../contexts";

const fetchData = async () => {
  try {
    const response = await axios.post("GetMachines");
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export default function HomeScreen() {
  const [list, setList] = useState([]);
  const { colors, fonts, spacing } = useContext(ThemeContext);
  const { Toast } = useContext(ToastContext);

  const [messages, setMessages] = useState({
    color: "",
    messageLabel: "",
    messageTitle: [],
  });

  console.log("HomeScreen");

  useMemo(() => {
    const getData = async () => {
      const data = await fetchData();
      setList(data || []);
    };

    getData();
  }, []);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      flex: 1,
      padding: spacing.md,
    },
    textHeader: {
      fontSize: 24,
      alignSelf: "center",
      margin: spacing.xs,
    },
    textContent: {
      fontSize: 16,
      margin: spacing.xs,
      marginTop: spacing.xl,
      color: colors.text,
    },
    textInTouche: {
      fontSize: 16,
      color: colors.light,
      alignSelf: "center",
      padding: spacing.xs,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.textHeader}>KFM Form</Text>
    </View>
  );
}
