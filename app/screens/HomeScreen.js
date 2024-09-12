import React, { useState, useEffect, useCallback } from "react";
import { Text, View, FlatList, Pressable, ScrollView } from "react-native";
import { Button, Card } from "@rneui/themed";
import { useTheme, useToast, useRes } from "../contexts";
import axios from "../../config/axios";
import screenStyles from "../styles/screens/screen";
import { useFocusEffect } from "@react-navigation/native";

const HomeScreen = ({ navigation }) => {
  const [machineGroup, setMachineGroup] = useState({});
  const [machine, setMachine] = useState({});
  const { colors, fonts, spacing } = useTheme();
  const { Toast } = useToast();
  const { responsive } = useRes();
  const styles = screenStyles({ colors, spacing, fonts, responsive });

  useFocusEffect(
    useCallback(() => {
      console.log("ScreenA is focused");
      return () => {
        console.log("ScreenA is unfocused");
      };
    }, [])
  );

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
        const [machineGroupResponse, machineResponse] = await Promise.all([
          axios.post("GetMachineGroups"),
          axios.post("GetMachines"),
        ]);
        setMachineGroup(machineGroupResponse.data.data ?? []);
        setMachine(machineResponse.data.data ?? []);
      } catch (error) {
        ShowMessages(
          error.message || "Error",
          error.response ? error.response.data.errors : ["Something wrong!"],
          "error"
        );
      }
    };

    fetchData();
  }, []);

  console.log("Home");

  const handleMenu = (item) => {
    navigation.navigate(item);
  };

  console.log(machineGroup);

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <Card>
        <Card.Title>KFM Form</Card.Title>
        <Card.Divider />
        <Text style={[styles.textHeader, { color: colors.text }]}>
          List Menu
        </Text>

        <View>
          <Pressable onPress={() => handleMenu("Machine Group")}>
            <Text style={styles.text}>Create Machine Group</Text>
          </Pressable>
          <Pressable onPress={() => handleMenu("Machine")}>
            <Text style={styles.text}>Create Machine</Text>
          </Pressable>
          <Pressable onPress={() => handleMenu("Check List")}>
            <Text style={styles.text}>Create Check List</Text>
          </Pressable>
          <Pressable onPress={() => handleMenu("Check List Option")}>
            <Text style={styles.text}>Create Check List Option</Text>
          </Pressable>
          <Pressable onPress={() => handleMenu("Group Check List Option")}>
            <Text style={styles.text}>Create Group Check List Option</Text>
          </Pressable>
          <Pressable onPress={() => handleMenu("Forms")}>
            <Text style={styles.text}>Create Form</Text>
          </Pressable>
          <Pressable onPress={() => handleMenu("Match Form & Machine")}>
            <Text style={styles.text}>Create Machine Form</Text>
          </Pressable>
        </View>
      </Card>

      <Card>
        <Card.Title>List Group</Card.Title>
        <Card.Divider />
        <View>
          <FlatList
            data={machineGroup}
            renderItem={({ item, index }) => {
              <View>
                <Text style={styles.text}>Machine Group Name : {item}</Text>
                <Pressable>
                  <Text style={styles.text}>
                    Machine Group Name : {item.MGroupName}
                  </Text>
                </Pressable>
                {machine.filter((field, idx) => {
                  if (field.MGroupID === item.MGroupID)
                    <Pressable
                      key={`${field.index}-${idx}`}
                      style={styles.button}
                    >
                      <Text style={styles.text}>{field.MachineName}</Text>
                    </Pressable>;
                })}
              </View>;
            }}
            keyExtractor={(_, MGroupID) => `mgroup-${MGroupID}`}
          />
        </View>
      </Card>
    </ScrollView>
  );
};

export default HomeScreen;
