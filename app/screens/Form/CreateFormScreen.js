import React, { useState, useEffect, useMemo, useReducer } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Dialog, Input, Button, Divider } from "@rneui/themed";
import { DynamicForm, useResponsive, CustomDropdown } from "../../components";
import { colors, spacing, fonts } from "../../../theme";
import axios from "../../../config/axios";

const initial = { cards: [] };

const reducer = (state, action) => {
  const {
    selectedCardIndex,
    newCardName,
    newCardColumn,
    formState,
    selectedFieldIndex,
  } = action.payload;

  switch (action.type) {
    case "addcard":
      return {
        ...state,
        cards: [
          ...state.cards,
          {
            CardName: newCardName,
            CardColumns: parseInt(newCardColumn, 10),
            fields: [],
          },
        ],
      };

    case "updatecard":
      return {
        ...state,
        cards: state.cards.map((card, index) =>
          index === selectedCardIndex
            ? {
                ...card,
                CardName: newCardName,
                CardColumns: parseInt(newCardColumn, 10),
              }
            : card
        ),
      };
    case "addfield":
      return {
        ...state,
        cards: state.cards.map((card, index) =>
          index === selectedCardIndex
            ? {
                ...card,
                fields: [...card.fields, formState],
              }
            : card
        ),
      };
    case "updatefield":
      return {
        ...state,
        cards: state.cards.map((card, index) =>
          index === selectedCardIndex
            ? {
                ...card,
                fields: card.fields.map((field, fieldIndex) =>
                  fieldIndex === selectedFieldIndex ? formState : field
                ),
              }
            : card
        ),
      };
    default:
      return state;
  }
};

const FormBuilder = () => {
  const [state, dispatch] = useReducer(reducer, initial);
  const [showCardDialog, setShowCardDialog] = useState(false);
  const [showFieldDialog, setShowFieldDialog] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState(null);
  const [newCardName, setNewCardName] = useState("");
  const [newCardColumn, setNewCardColumn] = useState("");
  const [editMode, setEditMode] = useState(false);
  const responsive = useResponsive();
  const [formState, setFormState] = useState({
    detailQuestionId: "",
    questionId: "",
    mqoptionId: [],
    description: "",
    typeId: "",
    dataTypeId: "",
    displayOrder: "",
    machineId: "",
  });
  const [resetDropdown, setResetDropdown] = useState(false);
  const [question, setQuestion] = useState([]);
  const [machine, setMachine] = useState([]);
  const [detailQuestion, setDetailQuestion] = useState([]);
  const [type, setType] = useState([]);
  const [dataType, setDataType] = useState([]);
  const [formName, setFormName] = useState("");
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          questionResponse,
          optionResponse,
          questionDetailResponse,
          typeResponse,
          dataTypeResponse,
          machineResponse,
        ] = await Promise.all([
          axios.post("GetQuestions"),
          axios.post("GetQuestionOptions"),
          axios.post("GetQuestionDetails"),
          axios.post("GetTypes"),
          axios.post("GetDataTypes"),
          axios.post("GetMachines"),
        ]);
        setQuestion(questionResponse.data || []);
        setDetailQuestion(questionDetailResponse.data || []);
        setType(typeResponse.data || []);
        setDataType(dataTypeResponse.data || []);
        setMachine(machineResponse.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const saveCard = () => {
    switch (editMode) {
      case false:
        dispatch({
          type: "addcard",
          payload: {
            newCardName,
            newCardColumn,
          },
        });
        break;
      case true:
        dispatch({
          type: "updatecard",
          payload: {
            selectedCardIndex,
            newCardName,
            newCardColumn,
          },
        });
        setEditMode(false);
        break;
      default:
        break;
    }
    setShowCardDialog(false);
    setNewCardName("");
    setNewCardColumn("");
  };

  const saveField = () => {
    switch (editMode) {
      case false:
        dispatch({
          type: "addfield",
          payload: {
            formState,
            selectedCardIndex,
          },
        });
        break;
      case true:
        dispatch({
          type: "updatefield",
          payload: {
            formState,
            selectedCardIndex,
            selectedFieldIndex,
          },
        });
        setEditMode(false);
        break;
      default:
        break;
    }
    setFormState({
      questionId: "",
      mqoptionId: [],
      description: "",
      typeId: "",
      dataTypeId: "",
      displayOrder: "",
      machineId: "",
    });
    setShowFieldDialog(false);
  };

  const closeDialog = () => {
    setFormState({
      questionId: "",
      mqoptionId: [],
      description: "",
      typeId: "",
      dataTypeId: "",
      displayOrder: "",
      machineId: "",
    });
    setShowFieldDialog(false);
    setEditMode(false);
    setShowCardDialog(false);
    setNewCardName("");
    setNewCardColumn("");
  };

  console.log(state);

  useMemo(() => {
    const typeItem = type.find((item) => item.TypeID === formState.typeId);

    setShouldRender(
      typeItem &&
        (typeItem.TypeName === "DROPDOWN" ||
          typeItem.TypeName === "RADIO" ||
          typeItem.TypeName === "CHECKBOX")
    );
  }, [formState.typeId]);

  const handleChange = (fieldName, value) => {
    setFormState((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
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
      width: "67%",
      padding: 10,
      marginHorizontal: "2%",
      padding: 20,
    },
    card: {
      marginTop: 30,
      marginVertical: 10,
      marginHorizontal: 15,
      padding: 10,
      backgroundColor: "#fff",
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    cardTitle: {
      marginVertical: 10,
      marginHorizontal: 10,
      fontSize: 18,
      fontWeight: "bold",
    },
    formContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    fieldContainer: {
      margin: 5,
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
    text: {
      fontSize:
        responsive === "small"
          ? fonts.xsm
          : responsive === "medium"
          ? fonts.sm
          : fonts.xsm,
      color: colors.palette.light,
    },
    textHeader: {
      fontSize:
        responsive === "small"
          ? fonts.xmd
          : responsive === "medium"
          ? fonts.lg
          : fonts.xl,
      fontWeight: "bold",
      paddingLeft: "10%",
      color: colors.palette.light,
    },
    containerInput: {
      backgroundColor: "darkgray",
      marginVertical: spacing.md,
    },
    containerButton: {
      alignSelf: "center",
      width: "90%",
      marginVertical: "1%",
      marginHorizontal: "2%",
    },
    section: {
      padding: "2%",
      borderRadius: 5,
      backgroundColor: "white",
    },
    sectionHead: {
      fontSize: 24,
      fontWeight: "bold",
      alignSelf: "center",
      marginVertical: 5,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
    },
  });

  const renderCard = ({ item, index }) => (
    <View style={styles.card}>
      <Text>Card Name: {item.CardName}</Text>
      <Text>Card Columns: {item.CardColumns}</Text>
      <TouchableOpacity
        onPress={() => {
          setSelectedCardIndex(index);
          setNewCardName(item.CardName);
          setNewCardColumn(item.CardColumns.toString());
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
      {item.fields.map((field, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            setSelectedFieldIndex(index);
            setEditMode(true);
            setFormState(field);
            setShowFieldDialog(true);
          }}
        >
          <Text style={styles.button}>{field.questionId}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderLayout2 = () => {
    return (
      <FlatList
        data={state.cards}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.CardName}</Text>
            <View style={styles.formContainer}>
              {item.fields.map((field, index) => {
                const containerStyle = {
                  flexBasis: `${
                    responsive === "small" || responsive === "medium"
                      ? 100
                      : 100 / item.CardColumns
                  }%`,
                  flexGrow: field.displayOrder || 1,
                  padding: 5,
                };

                return (
                  <View key={index} style={containerStyle}>
                    <DynamicForm
                      fields={[field]}
                      type={type}
                      dataType={dataType}
                    />
                  </View>
                );
              })}
            </View>
          </View>
        )}
        keyExtractor={(index) => index.toString()}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.layout1}>
        <View style={{ margin: 30 }}>
          <Input
            label="Content Name"
            placeholder="Enter Content Name"
            labelStyle={[styles.text, { color: colors.text }]}
            inputStyle={[styles.text, { color: colors.text }]}
            disabledInputStyle={styles.containerInput}
            onChangeText={setFormName}
            value={formName}
          />
          <CustomDropdown
            fieldName="machineId"
            title="Machine"
            labels="MachineName"
            values="MachineID"
            data={machine}
            updatedropdown={handleChange}
            reset={resetDropdown}
            selectedValue={formState.machineId}
          />
          <Button
            title="Add Card"
            onPress={() => {
              setEditMode(false);
              setShowCardDialog(true);
            }}
          />
        </View>

        <FlatList
          data={state.cards}
          renderItem={renderCard}
          keyExtractor={(index) => index.toString()}
        />

        <Dialog isVisible={showCardDialog}>
          <View style={styles.dialogContainer}>
            <Input
              label="Card Name"
              placeholder="Enter Card Name"
              value={newCardName}
              labelStyle={[styles.text, { color: colors.text }]}
              inputStyle={[styles.text, { color: colors.text }]}
              disabledInputStyle={styles.containerInput}
              onChangeText={setNewCardName}
            />
            <Input
              label="Card Column"
              placeholder="Enter Number of Columns"
              value={newCardColumn}
              labelStyle={[styles.text, { color: colors.text }]}
              inputStyle={[styles.text, { color: colors.text }]}
              disabledInputStyle={styles.containerInput}
              onChangeText={setNewCardColumn}
            />
            <Button
              title={editMode ? "Update Card" : "Add Card"}
              onPress={() => saveCard()}
              titleStyle={styles.text}
              containerStyle={styles.containerButton}
            />
            <Button
              title="Cancel"
              onPress={closeDialog}
              titleStyle={styles.text}
              containerStyle={styles.containerButton}
            />
          </View>
        </Dialog>

        <Dialog isVisible={showFieldDialog}>
          <View style={styles.dialogContainer}>
            <CustomDropdown
              fieldName="questionId"
              title="Question"
              labels="QuestionName"
              values="QuestionID"
              data={question}
              updatedropdown={handleChange}
              reset={resetDropdown}
              selectedValue={formState.questionId}
            />

            <CustomDropdown
              fieldName="typeId"
              title="Type"
              labels="TypeName"
              values="TypeID"
              data={type}
              updatedropdown={handleChange}
              reset={resetDropdown}
              selectedValue={formState.typeId}
            />

            {shouldRender ? (
              <View>
                <CustomDropdown
                  fieldName="detailQuestionId"
                  title="Question Option"
                  labels="QuestionName"
                  values="MQOptionID"
                  data={detailQuestion}
                  updatedropdown={handleChange}
                  reset={resetDropdown}
                  selectedValue={formState.detailQuestionId}
                />
              </View>
            ) : (
              false
            )}

            <CustomDropdown
              fieldName="dataTypeId"
              title="Data Type"
              labels="DataTypeName"
              values="DataTypeID"
              data={dataType}
              updatedropdown={handleChange}
              reset={resetDropdown}
              selectedValue={formState.dataTypeId}
            />

            <Input
              label="Display Order"
              placeholder="Enter Display Order"
              labelStyle={[styles.text, { color: colors.text }]}
              inputStyle={[styles.text, { color: colors.text }]}
              disabledInputStyle={styles.containerInput}
              onChangeText={(text) => handleChange("displayOrder", text)}
              value={formState.displayOrder}
            />

            <Button
              title={editMode ? "Update Field" : "Add Field"}
              onPress={() => saveField()}
              titleStyle={styles.text}
              containerStyle={styles.containerButton}
            />
            <Button
              title="Cancel"
              onPress={closeDialog}
              titleStyle={styles.text}
              containerStyle={styles.containerButton}
            />
          </View>
        </Dialog>
      </View>

      <View style={styles.layout2}>
        <Text style={[styles.textHeader, { color: colors.palette.dark }]}>
          {formName ? formName : "Content Name"}
        </Text>
        {renderLayout2()}
      </View>
    </View>
  );
};

export default FormBuilder;
