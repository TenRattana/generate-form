import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Dialog } from "@rneui/themed";
import DynamicForm from "../../components/DynamicForm"; // Import your DynamicForm component

const FormBuilder = () => {
  const [cards, setCards] = useState([]);
  const [showCardDialog, setShowCardDialog] = useState(false);
  const [showFieldDialog, setShowFieldDialog] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState(null);
  const [newCardName, setNewCardName] = useState("");
  const [newCardColumn, setNewCardColumn] = useState("");
  const [newFieldName, setNewFieldName] = useState("");
  const [editMode, setEditMode] = useState(false);

  const addCard = () => {
    setCards([
      ...cards,
      { name: newCardName, columns: parseInt(newCardColumn, 10), fields: [] },
    ]);
    setShowCardDialog(false);
    setNewCardName("");
    setNewCardColumn("");
  };

  const updateCard = () => {
    const updatedCards = [...cards];
    updatedCards[selectedCardIndex] = {
      ...updatedCards[selectedCardIndex],
      name: newCardName,
      columns: parseInt(newCardColumn, 10),
    };
    setCards(updatedCards);
    setShowCardDialog(false);
    setNewCardName("");
    setNewCardColumn("");
    setEditMode(false);
  };

  const addField = () => {
    const updatedCards = [...cards];
    updatedCards[selectedCardIndex].fields.push({
      name: newFieldName,
      type: "text",
    }); // Change type as needed
    setCards(updatedCards);
    setShowFieldDialog(false);
    setNewFieldName("");
  };

  const updateField = () => {
    const updatedCards = [...cards];
    updatedCards[selectedCardIndex].fields[selectedFieldIndex].name =
      newFieldName;
    setCards(updatedCards);
    setShowFieldDialog(false);
    setNewFieldName("");
    setEditMode(false);
  };

  const closeField = () => {
    setShowFieldDialog(false);
    setNewFieldName("");
    setEditMode(false);
  };

  const closeCard = () => {
    setShowCardDialog(false);
    setNewCardName("");
    setNewCardColumn("");
    setEditMode(false);
  };

  const renderCard = ({ item, index }) => (
    <View style={styles.card}>
      <Text>Card: {item.name}</Text>
      <Text>Columns: {item.columns}</Text>
      <TouchableOpacity
        onPress={() => {
          setSelectedCardIndex(index);
          setNewCardName(item.name);
          setNewCardColumn(item.columns.toString());
          setEditMode(true);
          setShowCardDialog(true);
        }}
      >
        <Text style={styles.button}>Edit Card</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setSelectedCardIndex(index);
          setShowFieldDialog(true);
        }}
      >
        <Text style={styles.button}>Add Field</Text>
      </TouchableOpacity>
      {item.fields.map((field, idx) => (
        <TouchableOpacity
          key={idx}
          onPress={() => {
            setSelectedFieldIndex(idx);
            setNewFieldName(field.name);
            setEditMode(true);
            setShowFieldDialog(true);
          }}
        >
          <Text style={styles.button}>{field.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderLayout2 = () => (
    <FlatList
      data={cards}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <View style={styles.formContainer}>
            {item.fields.map((field, index) => {
              const columnWidth = `${100 / item.columns}%`;
              const containerStyle = {
                width: columnWidth,
                flex: item.columns > 1 ? 1 : 0,
                padding: 5,
              };

              return (
                <View key={index} style={containerStyle}>
                  <DynamicForm fields={[field]} />
                </View>
              );
            })}
            {/* Fill in remaining columns with empty spaces if fields are less than columns */}
            {item.fields.length % item.columns !== 0 &&
              Array.from({
                length: item.columns - (item.fields.length % item.columns),
              }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.fieldContainer,
                    { width: `${100 / item.columns}%`, opacity: 0 },
                  ]}
                />
              ))}
          </View>
        </View>
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.layout1}>
        <Button
          title="Add Card"
          onPress={() => {
            setEditMode(false);
            setShowCardDialog(true);
          }}
        />
        <FlatList
          data={cards}
          renderItem={renderCard}
          keyExtractor={(item, index) => index.toString()}
        />

        <Dialog isVisible={showCardDialog}>
          <View style={styles.dialogContainer}>
            <TextInput
              placeholder="Card Name"
              value={newCardName}
              onChangeText={setNewCardName}
            />
            <TextInput
              placeholder="Number of Columns"
              value={newCardColumn}
              onChangeText={setNewCardColumn}
              keyboardType="numeric"
            />
            <Button
              title={editMode ? "Update Card" : "Add Card"}
              onPress={editMode ? updateCard : addCard}
            />
            <Button title="Cancel" onPress={closeCard} />
          </View>
        </Dialog>

        <Dialog isVisible={showFieldDialog}>
          <View style={styles.dialogContainer}>
            <TextInput
              placeholder="Field Name"
              value={newFieldName}
              onChangeText={setNewFieldName}
            />
            <Button
              title={editMode ? "Update Field" : "Add Field"}
              onPress={editMode ? updateField : addField}
            />
            <Button title="Cancel" onPress={closeField} />
          </View>
        </Dialog>
      </View>

      <View style={styles.layout2}>{renderLayout2()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  layout1: {
    width: "30%",
    padding: 10,
  },
  layout2: {
    width: "70%",
    padding: 10,
  },
  card: {
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  dialogContainer: {
    padding: 20,
  },
  button: {
    padding: 10,
    backgroundColor: "#007bff",
    color: "#fff",
    textAlign: "center",
    borderRadius: 4,
    marginBottom: 10,
  },
  formContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  fieldContainer: {
    padding: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    flexBasis: 0,
  },
});

export default FormBuilder;
