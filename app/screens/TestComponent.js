import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";

const NUM_ITEMS = 10;

function getColor(i) {
  const multiplier = 255 / (NUM_ITEMS - 1);
  const colorVal = i * multiplier;
  return `rgb(${colorVal}, ${Math.abs(128 - colorVal)}, ${255 - colorVal})`;
}

const initialData = [...Array(NUM_ITEMS)].map((_, index) => {
  const backgroundColor = getColor(index);
  return {
    key: `item-${index}`,
    label: String(index + 1), // ใช้เลข 1 ถึง NUM_ITEMS
    height: 100,
    width: 60 + Math.random() * 40,
    backgroundColor,
  };
});

export default function App() {
  const [data, setData] = useState(initialData);

  const renderItem = ({ item, drag, isActive }) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag} // เรียกใช้งาน drag เมื่อกดนาน
          disabled={isActive} // ปิดการใช้งานเมื่อ item ถูกลาก
          style={[
            styles.rowItem,
            { backgroundColor: isActive ? "red" : item.backgroundColor },
          ]}
        >
          <Text style={styles.text}>{item.label}</Text>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <DraggableFlatList
        data={data}
        onDragEnd={({ data }) => setData(data)}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        scrollEnabled={true} // เปิดให้เลื่อน
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: 20, // เพิ่ม padding ข้างบนเพื่อให้มีพื้นที่ว่างสำหรับเนื้อหา
  },
  rowItem: {
    height: 100,
    width: "100%", // ขยายให้เต็มความกว้าง
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  text: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  listContainer: {
    padding: 10,
  },
});
