import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { colors, spacing } from "../../theme";
import axios from "../../config/axios";

export default function HomeScreen() {
  const [list, setList] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchData();
      setList(data || []);
    };

    getData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.post("GetMachines");
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

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
    buttonTouche: {
      width: "30%",
      margin: spacing.xs,
      height: 35,
      borderRadius: 10,
      elevation: 3,
      backgroundColor: colors.dark,
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
