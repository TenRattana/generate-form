import * as React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Menu, Button, Provider, List } from "react-native-paper";

const MyDropdown = () => {
  const [visible, setVisible] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState(null);

  const showMenu = () => setVisible(true);
  const hideMenu = () => setVisible(false);

  const handleItemPress = (id) => {
    setSelectedId(id);
    hideMenu();
  };

  const data = [
    { title: "Item 1", value: 1 },
    { title: "Item 2", value: 2 },
    { title: "Item 3", value: 3 },
    { title: "Item 4", value: 4 },
  ];

  return (
    <Provider>
      <View style={styles.container}>
        <Button onPress={showMenu} style={styles.button}>
          {selectedId ? `Selected: Item ${selectedId}` : "Select an item"}
        </Button>

        <Menu visible={visible} onDismiss={hideMenu} anchor={<View />}>
          <FlatList
            data={data}
            keyExtractor={(item) => item.value.toString()}
            renderItem={({ item }) => (
              <List.Item
                title={item.title}
                onPress={() => handleItemPress(item.value)}
                style={{
                  backgroundColor:
                    selectedId === item.value ? "#e0e0e0" : "white",
                }}
              />
            )}
          />
        </Menu>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  button: {
    marginBottom: 10,
  },
});

export default MyDropdown;
