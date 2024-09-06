import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { useTheme, useToast } from "../contexts";
import axios from "../../config/axios";

const HomeScreen = () => {
  const { colors, spacing } = useTheme();
  const { Toast } = useToast();
  const [machineGroup, setMachineGroup] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("GetMachineGroups");
        setMachineGroup(response.data.data || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  console.log("Home");

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.textHeader, { color: colors.text }]}>KFM Form</Text>
      <Text style={styles.textContent}>Machine Groups:</Text>
      {machineGroup.length > 0 ? (
        machineGroup.map((group, index) => (
          <Text key={index} style={styles.textContent}>
            {group.name}
          </Text>
        ))
      ) : (
        <Text style={styles.errorText}>No machine groups found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  textHeader: {
    fontSize: 24,
    alignSelf: "center",
    marginVertical: 8,
  },
  textContent: {
    fontSize: 16,
    marginVertical: 8,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});

export default HomeScreen;
