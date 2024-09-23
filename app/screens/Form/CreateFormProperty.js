import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

const CreateFormProperty = () => {
  const data = [
    { id: 1, name: "Rattana" },
    { id: 2, name: "asfasfasfa" },
    { id: 3, name: "xfgagagas" },
    { id: 4, name: "vagshae" },
    { id: 5, name: "asgaasg" },
    { id: 6, name: "otyirdtj" },
    { id: 7, name: "sdhirws" },
  ];

  const render = (item) => {
    return (
      <View style={styles.container}>
        <Text style={styles.name}>{item.name}</Text>
      </View>
    );
  };

  return (
    <View>
      <Text>CreateFormProperty</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Swipeable>{render(item)}</Swipeable>}
        contentContainerStyle={styles.grap}
      />
    </View>
  );
};

export default CreateFormProperty;

const styles = StyleSheet.create({
  container: {
    height: 62,
    backgroundColor: "#1D1F27",
    borderRadius: 5,
    paddingHorizontal: 5,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    color: "#FFF",
  },
  grap: {
    gap: 14,
  },
});
