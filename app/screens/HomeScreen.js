import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect , useContext } from "react";
import axios from "../../config/axios";
import { ThemeContext } from "../index";

export default function HomeScreen() {
  const [list, setList] = useState([]);
  const theme = useContext(ThemeContext);
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
      backgroundColor: theme.colors.background,
      flex: 1,
      padding: theme.spacing.md,
    },
    textHeader: {
      fontSize: 24,
      alignSelf: "center",
      margin: theme.spacing.xs,
    },
    textContent: {
      fontSize: 16,
      margin: theme.spacing.xs,
      marginTop: theme.spacing.xl,
      color: theme.colors.text,
    },
    buttonTouche: {
      width: "30%",
      margin: theme.spacing.xs,
      height: 35,
      borderRadius: 10,
      elevation: 3,
      backgroundColor: theme.colors.dark,
    },
    textInTouche: {
      fontSize: 16,
      color: theme.colors.light,
      alignSelf: "center",
      padding: theme.spacing.xs,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.textHeader}>KFM Form</Text>
    </View>
  );
}
