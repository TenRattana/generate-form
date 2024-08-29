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
import validator from "validator";

const initial = { cards: [] };

const reducer = (state, action) => {
  const {
    selectedCardIndex,
    formCard,
    formState,
    selectedFieldIndex,
    listType,
    list,
    matchListDetail,
  } = action.payload;

  switch (action.type) {
    case "addcard":
      return {
        ...state,
        cards: [
          ...state.cards,
          {
            cardName: formCard.cardName,
            cardColumns: parseInt(formCard.cardColumns, 10),
            cardDisplayOrder: parseInt(formCard.cardDisplayOrder, 10),
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
                cardName: formCard.cardName,
                cardColumns: parseInt(formCard.cardColumns, 10),
                cardDisplayOrder: parseInt(formCard.cardDisplayOrder, 10),
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
                      listType.find((v) => v.TypeID === formState.listTypeId)
                        ?.TypeName || "",
                    ListName:
                      list.find((v) => v.ListID === formState.listId)
                        ?.ListName || "",
                    MatchListDetail:
                      matchListDetail.find(
                        (v) => v.MLDetailID === formState.matchListDetailId
                      )?.MatchListDetail || [],
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
                            listType.find(
                              (v) => v.TypeID === formState.listTypeId
                            )?.TypeName || "",
                          ListName:
                            list.find((v) => v.ListID === formState.listId)
                              ?.ListName || "",
                          MatchListDetail:
                            matchListDetail.find(
                              (v) =>
                                v.MLDetailID === formState.matchListDetailId
                            )?.MatchListDetail || [],
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

const FormBuilder = ({ route }) => {
  const [state, dispatch] = useReducer(reducer, initial);
  const [showCardDialog, setShowCardDialog] = useState(false);
  const [showFieldDialog, setShowFieldDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState(null);
  const [formCard, setFormCard] = useState({
    cardName: "",
    cardColumns: "",
    cardDisplayOrder: "",
  });
  const [editMode, setEditMode] = useState(false);
  const responsive = useResponsive();
  const [error, setError] = useState({});
  const [formState, setFormState] = useState({
    matchListDetailId: "",
    listId: "",
    description: "",
    listTypeId: "",
    dataTypeId: "",
    displayOrder: "",
    placeholder: "",
  });
  const [resetDropdown, setResetDropdown] = useState(false);
  const [list, setList] = useState([]);
  const [machine, setMachine] = useState([]);
  const [listDetail, setListDetail] = useState([]);
  const [matchListDetail, setMatchListDetail] = useState([]);
  const [listType, setListType] = useState([]);
  const [dataType, setDataType] = useState([]);
  const [form, setForm] = useState({
    formId: "",
    formName: "",
  });
  const [shouldRender, setShouldRender] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { formIdforEdit } = route.params || {};

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
      const data = {
        FormID: formIdforEdit || "",
      };

      try {
        const listResponse = await axios.post("GetForm", data);

        setForm({
          formId: listResponse.data.data[0].FormID || "",
          formName: listResponse.data.data[0].FormName || "",
        });
      } catch (err) {
        setError(err);
      }
    };

    fetchData();
  }, [formIdforEdit]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          listResponse,
          listDetailResponse,
          matchListDetailResponse,
          listTypeResponse,
          dataTypeResponse,
          machineResponse,
        ] = await Promise.all([
          axios.post("GetLists"),
          axios.post("GetListDetails"),
          axios.post("GetMatchListDetails"),
          axios.post("GetListTypes"),
          axios.post("GetDataTypes"),
          axios.post("GetMachines"),
        ]);
        setList(listResponse.data.data || []);
        setListDetail(listDetailResponse.data.data || []);
        setMatchListDetail(matchListDetailResponse.data.data || []);
        setListType(listTypeResponse.data.data || []);
        setDataType(dataTypeResponse.data.data || []);
        setMachine(machineResponse.data.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleCard = (field, value) => {
    let errorMessage = "";

    if (field === "cardName" && validator.isEmpty(value.trim())) {
      errorMessage = "The Card Name field is required.";
    }

    if (field === "cardColumns" && !validator.isNumeric(value.trim())) {
      errorMessage = "The Card Column field must be numeric.";
    }

    if (field === "cardDisplayOrder" && !validator.isNumeric(value.trim())) {
      errorMessage = "The Card Display Order field must be numeric.";
    }

    setError((prevError) => ({
      ...prevError,
      [field]: errorMessage,
    }));

    setFormCard((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleForm = (field, value) => {
    setForm((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const saveForm = async () => {
    let messageHeader = "";
    let message = "";
    let type = "";

    const data = {
      Cards: JSON.stringify(state.cards),
      FormID: "",
      FormName: form.formName,
    };

    try {
      const responseData = await axios.post("SaveMatchList", data);
      setForm({
        formId: responseData.data.FormID || "",
        formName: responseData.data.FormName || "",
      });
      messageHeader = responseData.data.status ? "Success" : "Error";
      message = responseData.data.message;
      type = responseData.data.status ? "success" : "error";
      resetForm();
    } catch (error) {
      messageHeader = error.message;
      message = error.response.data.errors;
      type = "error";
    }
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
            formCard,
          },
        });
      }
    } else if (!editMode) {
      dispatch({
        type: "addcard",
        payload: {
          formCard,
        },
      });
    }
    resetForm();
  };

  const resetForm = () => {
    setFormState({
      matchListDetailId: "",
      listId: "",
      description: "",
      listTypeId: "",
      dataTypeId: "",
      displayOrder: "",
      placeholder: "",
    });
    setError({});
    setShowFieldDialog(false);
    setEditMode(false);
    setShowSaveDialog(false);
    setShowCardDialog(false);
    setFormCard({});
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
            listType,
            list,
            matchListDetail,
          },
        });
      }
    } else if (!editMode) {
      dispatch({
        type: "addfield",
        payload: {
          formState,
          selectedCardIndex,
          listType,
          list,
          matchListDetail,
        },
      });
    }
    resetForm();
  };

  useMemo(() => {
    const listTypeItem = listType.find(
      (item) => item.TypeID === formState.listTypeId
    );

    let op = "";

    if (listTypeItem) {
      if (
        listTypeItem.TypeName === "Dropdown" ||
        listTypeItem.TypeName === "Radio" ||
        listTypeItem.TypeName === "Checkbox"
      ) {
        op = "detail";
      } else if (
        listTypeItem.TypeName === "Textinput" ||
        listTypeItem.TypeName === "Textaera"
      ) {
        op = "text";
      }
    }

    setShouldRender(op);
  }, [formState.listTypeId]);

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
    errorText: {
      fontSize:
        responsive === "small"
          ? fonts.xsm
          : responsive === "medium"
          ? fonts.sm
          : fonts.xsm,
      marginLeft: spacing.xs,
      top: -spacing.xxs,
      color: colors.danger,
    },
  });

  const renderCard = ({ item, index }) => (
    <View style={styles.cardshow}>
      <TouchableOpacity
        onPress={() => {
          setSelectedCardIndex(index);
          setFormCard(item);
          setEditMode(true);
          setShowCardDialog(true);
        }}
        style={styles.button}
      >
        <Text style={styles.text}>Card : {item.cardName}</Text>
        <Entypo name="chevron-right" size={18} color={colors.palette.light} />
      </TouchableOpacity>

      {item.fields.map((field, idx) => (
        <TouchableOpacity
          key={`${field.ListName}-${idx}`}
          onPress={() => {
            setSelectedFieldIndex(idx);
            setEditMode(true);
            setFormState(field);
            setShowFieldDialog(true);
          }}
          style={[styles.button]}
        >
          <Text style={styles.text}>{field.ListName}</Text>
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
          <Text style={styles.cardTitle}>{item.cardName}</Text>
          <View style={styles.formContainer}>
            {item.fields.map((field, fieldIndex) => {
              const containerStyle = {
                flexBasis: `${
                  responsive === "small" || responsive === "medium"
                    ? 100
                    : 100 / item.cardColumns
                }%`,
                flexGrow: field.displayOrder || 1,
                padding: 5,
              };

              return (
                <View
                  key={`field-${fieldIndex}-${item.cardName}`}
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
              onPress={resetForm}
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
              value={formCard.cardName || ""}
              labelStyle={[styles.text, { color: colors.text }]}
              inputStyle={[styles.text, { color: colors.text }]}
              disabledInputStyle={styles.containerInput}
              onChangeText={(text) => handleCard("cardName", text)}
            />
            {error.cardName ? (
              <Text style={styles.errorText}>{error.cardName}</Text>
            ) : null}

            <Input
              label="Card Column"
              placeholder="Enter Number of Columns"
              value={formCard.cardColumns || ""}
              labelStyle={[styles.text, { color: colors.text }]}
              inputStyle={[styles.text, { color: colors.text }]}
              disabledInputStyle={styles.containerInput}
              onChangeText={(text) => handleCard("cardColumns", text)}
            />
            {error.cardColumns ? (
              <Text style={styles.errorText}>{error.cardColumns}</Text>
            ) : null}

            <Input
              label="Card Display Order"
              placeholder="Enter Display Order Number"
              value={formCard.cardDisplayOrder || ""}
              labelStyle={[styles.text, { color: colors.text }]}
              inputStyle={[styles.text, { color: colors.text }]}
              disabledInputStyle={styles.containerInput}
              onChangeText={(text) => handleCard("cardDisplayOrder", text)}
            />
            {error.cardDisplayOrder ? (
              <Text style={styles.errorText}>{error.cardDisplayOrder}</Text>
            ) : null}

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
                onPress={resetForm}
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
              fieldName="listId"
              title="List"
              labels="ListName"
              values="ListID"
              data={list}
              updatedropdown={handleChange}
              reset={resetDropdown}
              selectedValue={formState.listId}
            />

            <CustomDropdown
              fieldName="listTypeId"
              title="Type"
              labels="TypeName"
              values="TypeID"
              data={listType}
              updatedropdown={handleChange}
              reset={resetDropdown}
              selectedValue={formState.listTypeId}
            />

            {shouldRender === "detail" ? (
              <Animated.View
                style={[styles.animatedText, { opacity: fadeAnim }]}
              >
                <CustomDropdown
                  fieldName="matchListDetailId"
                  title="Group List Detail"
                  labels="ListName"
                  values="MLDetailID"
                  data={matchListDetail}
                  updatedropdown={handleChange}
                  reset={resetDropdown}
                  selectedValue={formState.matchListDetailId}
                />
              </Animated.View>
            ) : shouldRender === "text" ? (
              <Animated.View
                style={[styles.animatedText, { opacity: fadeAnim }]}
              >
                <CustomDropdown
                  fieldName="dataTypeId"
                  title="Data Type"
                  labels="DTypeName"
                  values="DTypeID"
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
                onPress={resetForm}
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
