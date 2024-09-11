import React, { useState, useEffect } from "react";
import { Text, View, FlatList } from "react-native";
import { Button, Card } from "@rneui/themed";
import { useTheme, useToast, useRes } from "../contexts";
import axios from "../../config/axios";
import screenStyles from "../styles/screens/screen";

const HomeScreen = ({ navigation }) => {
  const [machineGroup, setMachineGroup] = useState({});
  const [machine, setMachine] = useState({});
  const { colors, fonts, spacing } = useTheme();
  const { Toast } = useToast();
  const { responsive } = useRes();
  const styles = screenStyles({ colors, spacing, fonts, responsive });

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

  const containerStyle = {
    flex: 1,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  };

  const renderItem = ({ item, index }) => {
    <View style={styles.cardshow}>
      {/* {item.fields.map((field, idx) => (
        <TouchableOpacity
          key={`${field.CheckListName}-${idx}`}
          onPress={() => {
            setSelectedIndex((prev) => ({
              ...prev,
              subForm: index,
              field: idx,
            }));
            setEditMode(true);
            setFormState(field);
            setShowDialogs((prev) => ({ ...prev, field: true }));
          }}
          style={styles.button}
        >
          <Text style={styles.text}>{field.CheckListName}</Text>
          <Entypo name="chevron-right" size={18} color={colors.palette.light} />
        </TouchableOpacity>
      ))} */}
    </View>;
  };

  const handleMenu = (item) => {
    navigation.navigate(item);
  };

  return (
    <View>
      <Card>
        <Card.Title>KFM Form</Card.Title>
        <Card.Divider />
        <Text style={[styles.textHeader, { color: colors.text }]}>
          List Menu
        </Text>

        <View style={containerStyle}>
          <Button
            title="Create Machine Group"
            type="outline"
            titleStyle={styles.text}
            containerStyle={styles.containerButton}
            onPress={() => handleMenu("Machine Group")}
          />
          <Button
            title="Create Machine"
            type="outline"
            titleStyle={styles.text}
            containerStyle={styles.containerButton}
            onPress={() => handleMenu("Machine")}
          />
          <Button
            title="Create Check List"
            type="outline"
            titleStyle={styles.text}
            containerStyle={styles.containerButton}
            onPress={() => handleMenu("Check List")}
          />
          <Button
            title="Create Check List Option"
            type="outline"
            titleStyle={styles.text}
            containerStyle={styles.containerButton}
            onPress={() => handleMenu("Check List Option")}
          />
          <Button
            title="Create Group Check List Option"
            type="outline"
            titleStyle={styles.text}
            containerStyle={styles.containerButton}
            onPress={() => handleMenu("Group Check List Option")}
          />
          <Button
            title="Create Form"
            type="outline"
            titleStyle={styles.text}
            containerStyle={styles.containerButton}
            onPress={() => handleMenu("Forms")}
          />
          <Button
            title="Create Machine Form"
            type="outline"
            titleStyle={styles.text}
            containerStyle={styles.containerButton}
            onPress={() => handleMenu("Match Form & Machine")}
          />
        </View>
      </Card>

      <Card>
        <Card.Title>List Form</Card.Title>
        <Card.Divider />
        <View style={containerStyle}>
          <FlatList
            data={machineGroup}
            renderItem={renderItem}
            keyExtractor={(_, index) => index}
          />
        </View>
      </Card>
    </View>
  );
};

export default HomeScreen;
