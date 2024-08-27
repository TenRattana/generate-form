import React, { useState, useEffect, useMemo, useReducer, useRef } from "react";

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  Easing,
} from "react-native";

import { Dialog, Input, Button } from "@rneui/themed";
import { DynamicForm, useResponsive, CustomDropdown } from "../../components";
import { colors, spacing, fonts } from "../../../theme";
import axios from "../../../config/axios";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";

const initial = { cards: [] };

const reducer = (state, action) => {
  const {
    selectedCardIndex,
    newCardName,
    newCardColumn,
    formState,
    selectedFieldIndex,
    type,
    question,
    detailQuestion,
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
    case "deletecard":
      return {
        ...state,
        cards: state.cards.filter(
          (_, cardIndex) => cardIndex !== selectedCardIndex
        ),
      };
    case "addfield":
      return {
        ...state,
        cards: state.cards.map((card, index) =>
          index === selectedCardIndex
            ? {
                ...card,
                fields: [
                  ...card.fields,
                  {
                    ...formState,
                    TypeName:
                      type.find((v) => v.TypeID === formState.typeId)
                        ?.TypeName || "",
                    QuestionName:
                      question.find(
                        (v) => v.QuestionID === formState.questionId
                      )?.QuestionName || "",
                    MatchQuestionOptions:
                      detailQuestion.find(
                        (v) => v.MQOptionID === formState.detailQuestionId
                      )?.MatchQuestionOptions || [],
                  },
                ].sort(
                  (a, b) => parseInt(a.displayOrder) - parseInt(b.displayOrder)
                ),
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
                fields: card.fields
                  .map((field, fieldIndex) =>
                    fieldIndex === selectedFieldIndex
                      ? {
                          ...formState,
                          TypeName:
                            type.find((v) => v.TypeID === formState.typeId)
                              ?.TypeName || "",
                          QuestionName:
                            question.find(
                              (v) => v.QuestionID === formState.questionId
                            )?.QuestionName || "",
                          MatchQuestionOptions:
                            detailQuestion.find(
                              (v) => v.MQOptionID === formState.detailQuestionId
                            )?.MatchQuestionOptions || [],
                        }
                      : field
                  )
                  .sort(
                    (a, b) =>
                      parseInt(a.displayOrder) - parseInt(b.displayOrder)
                  ),
              }
            : card
        ),
      };
    case "deletefield":
      return {
        ...state,
        cards: state.cards.map((card, index) =>
          index === selectedCardIndex
            ? {
                ...card,
                fields: card.fields.filter(
                  (_, fieldIndex) => fieldIndex !== selectedFieldIndex
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
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState(null);
  const [newCardName, setNewCardName] = useState("");
  const [newCardColumn, setNewCardColumn] = useState("");
  const [editMode, setEditMode] = useState(false);
  const responsive = useResponsive();
  const [formState, setFormState] = useState({
    detailQuestionId: "",
    questionId: "",
    description: "",
    typeId: "",
    dataTypeId: "",
    displayOrder: "",
    machineId: "",
    placeholder: "",
  });
  const [resetDropdown, setResetDropdown] = useState(false);
  const [question, setQuestion] = useState([]);
  const [machine, setMachine] = useState([]);
  const [detailQuestion, setDetailQuestion] = useState([]);
  const [type, setType] = useState([]);
  const [dataType, setDataType] = useState([]);
  const [form, setForm] = useState({
    formId: "",
    formName: "",
  });
  const [shouldRender, setShouldRender] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (shouldRender !== "") {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.in,
        useNativeDriver: true,
      }).start();
    }
  }, [shouldRender]);

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

  const handleForm = (field, value) => {
    setForm((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const saveForm = () => {
    console.log(state);
  };

  const saveCard = (option) => {
    if (editMode) {
      if (option === "delete") {
        dispatch({
          type: "deletecard",
          payload: {
            selectedCardIndex,
          },
        });
      } else {
        dispatch({
          type: "updatecard",
          payload: {
            selectedCardIndex,
            newCardName,
            newCardColumn,
          },
        });
        setEditMode(false);
      }
    } else if (!editMode) {
      dispatch({
        type: "addcard",
        payload: {
          newCardName,
          newCardColumn,
        },
      });
    }
    setShowCardDialog(false);
    setNewCardName("");
    setNewCardColumn("");
  };

  const saveField = (option) => {
    if (editMode) {
      if (option === "delete") {
        dispatch({
          type: "deletefield",
          payload: {
            formState,
            selectedCardIndex,
            selectedFieldIndex,
          },
        });
      } else {
        dispatch({
          type: "updatefield",
          payload: {
            formState,
            selectedCardIndex,
            selectedFieldIndex,
            type,
            question,
            detailQuestion,
          },
        });
        setEditMode(false);
      }
    } else if (!editMode) {
      dispatch({
        type: "addfield",
        payload: {
          formState,
          selectedCardIndex,
          type,
          question,
          detailQuestion,
        },
      });
    }
    setFormState({
      detailQuestionId: "",
      questionId: "",
      description: "",
      typeId: "",
      dataTypeId: "",
      displayOrder: "",
      machineId: "",
      placeholder: "",
    });
    setShowFieldDialog(false);
  };

  const closeDialog = () => {
    setFormState({
      detailQuestionId: "",
      questionId: "",
      description: "",
      typeId: "",
      dataTypeId: "",
      displayOrder: "",
      machineId: "",
      placeholder: "",
    });
    setShowFieldDialog(false);
    setEditMode(false);
    setShowSaveDialog(false);
    setShowCardDialog(false);
    setNewCardName("");
    setNewCardColumn("");
  };

  useMemo(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
    }).start();

    const typeItem = type.find((item) => item.TypeID === formState.typeId);
    const op =
      typeItem &&
      (typeItem.TypeName === "DROPDOWN" ||
        typeItem.TypeName === "RADIO" ||
        typeItem.TypeName === "CHECKBOX")
        ? "detail"
        : typeItem &&
          (typeItem.TypeName === "TEXTINPUT" ||
            typeItem.TypeName === "TEXTAERA")
        ? "text"
        : "";

    setShouldRender(op);
  }, [formState.typeId]);

  const handleChange = (fieldName, value) => {
    setFormState((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const { width } = Dimensions.get("window");

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: responsive === "small" ? "column" : "row",
      flexWrap: responsive === "small" ? "nowrap" : "wrap",
    },
    layout1: {
      padding: 10,
      width: responsive === "small" ? "100%" : 400,
      backgroundColor: colors.palette.dark4,
    },
    layout2: {
      padding: 10,
      width: responsive === "small" ? "100%" : width - 420,
    },
    cardshow: {
      marginTop: 30,
      marginVertical: 10,
      marginHorizontal: 15,
      padding: 10,
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
      width: responsive === "small" || responsive === "medium" ? "90%" : 650,
    },
    viewDialog: {
      paddingTop: 30,
    },
    button: {
      padding: 10,
      backgroundColor: colors.palette.background2,
      textAlign: "center",
      borderRadius: 4,
      marginBottom: 5,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    text: {
      fontSize: responsive === "small" ? fonts.sm : fonts.xsm,
      color: colors.palette.light,
    },
    textHeader: {
      fontSize: responsive === "small" ? fonts.xmd : fonts.lg,
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
    <View style={styles.cardshow}>
      <TouchableOpacity
        onPress={() => {
          setSelectedCardIndex(index);
          setNewCardName(item.CardName);
          setNewCardColumn(item.CardColumns.toString());
          setEditMode(true);
          setShowCardDialog(true);
        }}
        style={styles.button}
      >
        <Text style={styles.text}>Card : {item.CardName}</Text>
        <Entypo name="chevron-right" size={18} color={colors.palette.light} />
      </TouchableOpacity>

      {item.fields.map((field, idx) => (
        <TouchableOpacity
          key={`${field.QuestionName}-${idx}`}
          onPress={() => {
            setSelectedFieldIndex(idx);
            setEditMode(true);
            setFormState(field);
            setShowFieldDialog(true);
          }}
          style={[styles.button]}
        >
          <Text style={styles.text}>{field.QuestionName}</Text>
          <Entypo name="chevron-right" size={18} color={colors.palette.light} />
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        onPress={() => {
          setSelectedCardIndex(index);
          setShowFieldDialog(true);
        }}
      >
        <Text style={[styles.button, { color: colors.palette.blue }]}>
          <AntDesign name="plus" size={16} color={colors.palette.blue} />
          Add Field
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderLayout2 = () => (
    <FlatList
      data={state.cards}
      renderItem={({ item, index }) => (
        <View style={styles.card} key={`card-${index}`}>
          <Text style={styles.cardTitle}>{item.CardName}</Text>
          <View style={styles.formContainer}>
            {item.fields.map((field, fieldIndex) => {
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
                <View
                  key={`field-${fieldIndex}-${item.CardName}`}
                  style={containerStyle}
                >
                  <DynamicForm fields={[field]} />
                </View>
              );
            })}
          </View>
        </View>
      )}
      keyExtractor={(item, index) => `card-${index}`}
    />
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.layout1}>
        <View style={{ margin: 30 }}>
          <Input
            label="Content Name"
            placeholder="Enter Content Name"
            labelStyle={styles.text}
            inputStyle={styles.text}
            disabledInputStyle={styles.containerInput}
            onChangeText={(text) => handleForm("formName", text)}
            value={form.formName}
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
            optionStyle={{ color: colors.palette.light }}
          />
          <TouchableOpacity
            onPress={() => {
              setEditMode(false);
              setShowCardDialog(true);
            }}
          >
            <Text style={[styles.button, { color: colors.palette.blue }]}>
              <AntDesign name="plus" size={16} color={colors.palette.blue} />
              Add Card
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setEditMode(false);
              setShowSaveDialog(true);
            }}
            style={{ marginTop: 10 }}
          >
            <Text
              style={[
                styles.button,
                {
                  color: colors.palette.light,
                  backgroundColor: colors.palette.green,
                },
              ]}
            >
              Save Form
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={state.cards}
          renderItem={renderCard}
          keyExtractor={(item, index) => `card-${index}`}
        />

        <Dialog
          isVisible={showSaveDialog}
          overlayStyle={styles.dialogContainer}
        >
          <Dialog.Title
            title="Save Form"
            titleStyle={[
              styles.textHeader,
              {
                justifyContent: "center",
                color: colors.palette.dark,
              },
            ]}
          />
          <Text
            style={[
              styles.textHeader,
              styles.text,
              {
                justifyContent: "center",
                color: colors.palette.dark,
                fontWeight: "regular",
              },
            ]}
          >
            You are about to save the form. Are you sure?
          </Text>

          <View
            style={[
              styles.viewDialog,
              {
                flexDirection: responsive === "small" ? "column" : "row",
                justifyContent: "center",
              },
            ]}
          >
            <Button
              title="Save"
              onPress={() => saveForm()}
              titleStyle={styles.text}
              containerStyle={[
                styles.containerButton,
                { width: responsive === "small" ? "100%" : "30%" },
              ]}
            />
            <Button
              title="Cancel"
              onPress={closeDialog}
              titleStyle={styles.text}
              containerStyle={[
                styles.containerButton,
                { width: responsive === "small" ? "100%" : "30%" },
              ]}
            />
          </View>
        </Dialog>

        <Dialog
          isVisible={showCardDialog}
          overlayStyle={styles.dialogContainer}
        >
          <View style={styles.viewDialog}>
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
            <View
              style={[
                styles.viewDialog,
                {
                  flexDirection: responsive === "small" ? "column" : "row",
                  justifyContent: "center",
                },
              ]}
            >
              <Button
                title={editMode ? "Update Card" : "Add Card"}
                onPress={() => saveCard()}
                titleStyle={styles.text}
                containerStyle={[
                  styles.containerButton,
                  { width: responsive === "small" ? "100%" : "30%" },
                ]}
              />
              {editMode && (
                <Button
                  title={"Delete Card"}
                  onPress={() => saveCard("delete")}
                  titleStyle={styles.text}
                  containerStyle={[
                    styles.containerButton,
                    { width: responsive === "small" ? "100%" : "30%" },
                  ]}
                />
              )}
              <Button
                title="Cancel"
                onPress={closeDialog}
                titleStyle={styles.text}
                containerStyle={[
                  styles.containerButton,
                  { width: responsive === "small" ? "100%" : "30%" },
                ]}
              />
            </View>
          </View>
        </Dialog>

        <Dialog
          isVisible={showFieldDialog}
          overlayStyle={styles.dialogContainer}
        >
          <View style={styles.viewDialog}>
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

            {shouldRender === "detail" ? (
              <Animated.View
                style={[styles.animatedText, { opacity: fadeAnim }]}
              >
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
              </Animated.View>
            ) : shouldRender === "text" ? (
              <Animated.View
                style={[styles.animatedText, { opacity: fadeAnim }]}
              >
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
                  label="Placeholder"
                  placeholder="Enter Placeholder"
                  labelStyle={[styles.text, { color: colors.text }]}
                  inputStyle={[styles.text, { color: colors.text }]}
                  disabledInputStyle={styles.containerInput}
                  onChangeText={(text) => handleChange("placeholder", text)}
                  value={formState.placeholder}
                />
              </Animated.View>
            ) : null}

            <Input
              label="Display Order"
              placeholder="Enter Display Order"
              labelStyle={[styles.text, { color: colors.text }]}
              inputStyle={[styles.text, { color: colors.text }]}
              disabledInputStyle={styles.containerInput}
              onChangeText={(text) => handleChange("displayOrder", text)}
              value={formState.displayOrder}
            />

            <View
              style={[
                styles.viewDialog,
                {
                  flexDirection: responsive === "small" ? "column" : "row",
                  justifyContent: "center",
                },
              ]}
            >
              <Button
                title={editMode ? "Update Field" : "Add Field"}
                onPress={() => saveField()}
                titleStyle={styles.text}
                containerStyle={[
                  styles.containerButton,
                  { width: responsive === "small" ? "100%" : "30%" },
                ]}
              />
              {editMode && (
                <Button
                  title={"Delete Field"}
                  onPress={() => saveField("delete")}
                  titleStyle={styles.text}
                  containerStyle={[
                    styles.containerButton,
                    { width: responsive === "small" ? "100%" : "30%" },
                  ]}
                />
              )}

              <Button
                title="Cancel"
                onPress={closeDialog}
                titleStyle={styles.text}
                containerStyle={[
                  styles.containerButton,
                  { width: responsive === "small" ? "100%" : "30%" },
                ]}
              />
            </View>
          </View>
        </Dialog>
      </View>

      <View style={styles.layout2}>
        <Text style={[styles.textHeader, { color: colors.palette.dark }]}>
          {form.formName ? form.formName : "Content Name"}
        </Text>
        {renderLayout2()}
      </View>
    </ScrollView>
  );
};

export default FormBuilder;
