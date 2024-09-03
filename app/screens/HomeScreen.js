import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme, useToast } from "../contexts";
import { axios } from "../../config";
import { useIsFocused } from "@react-navigation/native";

const HomeScreen = () => {
  const { colors, spacing } = useTheme();
  const { Toast } = useToast();
  const [machineGroup, setMachineGroup] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      const fetchData = async () => {
        try {
          const response = await axios.post("GetMachineGroups");
          setMachineGroup(response.data.data || []);
        } catch (error) {
          console.log(error);
        }
      };

      fetchData();
    }
  }, [isFocused]);

  console.log("Home");

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
    errorText: {
      fontSize: 16,
      color: "red",
      textAlign: "center",
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.textHeader}>KFM Form</Text>
    </View>
  );
};

export default HomeScreen;
