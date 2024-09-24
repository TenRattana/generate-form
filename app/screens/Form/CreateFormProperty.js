import React, { useState } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const CreateFormProperty = () => {
  const [data, setData] = useState([
    { id: "1", name: "Item 1" },
    { id: "2", name: "Item 2" },
    { id: "3", name: "Item 3" },
    { id: "4", name: "Item 4" },
  ]);

  const renderItem = (item, index) => {
    const translateY = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
    }));

    const onGestureEvent = (event) => {
      translateY.value = event.translationY;
    };

    const onGestureEnd = () => {
      const { translationY } = translateY;
      let newData = [...data];

      if (translationY > 50 && index < data.length - 1) {
        const movedItem = newData.splice(index, 1)[0];
        newData.splice(index + 1, 0, movedItem);
      } else if (translationY < -50 && index > 0) {
        const movedItem = newData.splice(index, 1)[0];
        newData.splice(index - 1, 0, movedItem);
      }

      setData(newData);
      translateY.value = withSpring(0);
    };

    return (
      <PanGestureHandler onGestureEvent={onGestureEvent} onEnded={onGestureEnd}>
        <Animated.View style={[animatedStyle, styles.itemContainer]}>
          <Text style={styles.itemText}>{item.name}</Text>
        </Animated.View>
      </PanGestureHandler>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Drag and Drop Example</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => renderItem(item, index)}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default CreateFormProperty;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  list: {
    gap: 10,
  },
  itemContainer: {
    height: 60,
    backgroundColor: "#1D1F27",
    borderRadius: 5,
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  itemText: {
    color: "#FFF",
    fontSize: 16,
  },
});
