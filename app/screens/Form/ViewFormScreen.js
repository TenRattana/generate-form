import React, { useState, useEffect, useReducer } from "react";
import { ScrollView, View, Text, StyleSheet, FlatList } from "react-native";
import axios from "../../../config/axios";
import { Divider, Button } from "@rneui/themed";
import { useResponsive, DynamicForm } from "../../components";
import { colors, spacing, fonts } from "../../../theme";

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

  const parseCardColumns = parseInt(formCard?.cardColumns, 10);
  const parseCardDisplayOrder = parseInt(formCard?.cardDisplayOrder, 10);
  const parseDisplayOrder = parseInt(formState?.displayOrder, 10);

  const getTypeName = (typeId) => {
    return listType.find((v) => v.TypeID === typeId)?.TypeName || "";
  };

  const getListName = (listId) => {
    return list.find((v) => v.ListID === listId)?.ListName || "";
  };

  const getMatchListDetail = (mlDetailId) => {
    return (
      matchListDetail.find((v) => v.MLDetailID === mlDetailId)
        ?.MatchListDetail || []
    );
  };

  switch (action.type) {
    case "setCards":
      return {
        ...state,
        cards: [
          ...formCard.map((card) => ({
            cardName: card.cardName,
            cardColumns: card.cardColumns,
            cardDisplayOrder: card.cardDisplayOrder,
            fields: [],
          })),
        ],
      };

    case "setFields":
      return {
        ...state,
        cards: state.cards.map((card, cardIndex) => {
          const updatedFields = formState
            .filter((field) => field.index === cardIndex)
            .map((field) => ({
              ...field.field,
              TypeName: getTypeName(field.field.listTypeId),
              ListName: getListName(field.field.listId),
              MatchListDetail: getMatchListDetail(
                field.field.matchListDetailId
              ),
            }))
            .sort(
              (a, b) => parseInt(a.displayOrder) - parseInt(b.displayOrder)
            );

          return {
            ...card,
            fields: [...card.fields, ...updatedFields],
          };
        }),
      };
    case "reset":
      return { state: initial };
    default:
      return state;
  }
};

const ViewFormScreen = () => {
  const [state, dispatch] = useReducer(reducer, initial);
  const [list, setList] = useState([]);
  const [machine, setMachine] = useState([]);
  const [listDetail, setListDetail] = useState([]);
  const [matchListDetail, setMatchListDetail] = useState([]);
  const [listType, setListType] = useState([]);
  const [dataType, setDataType] = useState([]);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [form, setForm] = useState({
    formId: "",
    formName: "",
  });
  const responsive = useResponsive();
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          listResponse,
          listDetailResponse,
          matchListDetailResponse,
          listTypeResponse,
          dataTypeResponse,
        ] = await Promise.all([
          axios.post("GetLists"),
          axios.post("GetListDetails"),
          axios.post("GetMatchListDetails"),
          axios.post("GetListTypes"),
          axios.post("GetDataTypes"),
        ]);
        setList(listResponse.data.data || []);
        setListDetail(listDetailResponse.data.data || []);
        setMatchListDetail(matchListDetailResponse.data.data || []);
        setListType(listTypeResponse.data.data || []);
        setDataType(dataTypeResponse.data.data || []);
        setIsDataLoaded(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isDataLoaded) {
      const fetchData = async () => {
        const data = {
          FormID: "F006",
        };

        try {
          const listResponse = await axios.post("GetForm", data);
          const formDataResponse = listResponse.data.data;

          if (formDataResponse.length > 0) {
            const firstItem = formDataResponse[0];

            setForm({
              formId: firstItem.FormID || "",
              formName: firstItem.FormName || "",
            });

            const cards = [];
            const fields = [];

            formDataResponse.forEach((item, index) => {
              const card = {
                cardName: item.CardName,
                cardColumns: item.Columns,
                cardDisplayOrder: item.DisplayOrder,
              };

              item.MatchListDetail.forEach((itemDetail) => {
                const field = {
                  matchListDetailId: itemDetail.MLDetailID,
                  mListId: itemDetail.MListID,
                  listId: itemDetail.ListID,
                  description: "",
                  listTypeId: itemDetail.TypeID,
                  dataTypeId: itemDetail.DTypeID,
                  displayOrder: itemDetail.DisplayOrder,
                  placeholder: "",
                };
                fields.push({ field, index });
              });

              cards.push(card);
            });
            dispatch({ type: "setCards", payload: { formCard: cards } });
            dispatch({
              type: "setFields",
              payload: { formState: fields, listType, list, matchListDetail },
            });
          }
        } catch (err) {}
      };
      fetchData();
    }
  }, [isDataLoaded]);

  const handleFieldChange = (fieldName, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Form Data:", formData);
  };

  const styles = StyleSheet.create({
    container: {
      padding: 20,
      marginBottom: 30,
    },
    section: {
      padding: "2%",
      marginBottom: 20,
      borderRadius: 5,
      backgroundColor: "white",
    },
    sectionHead: {
      fontSize: 24,
      fontWeight: "bold",
      alignSelf: "center",
      marginVertical: 5,
      marginBottom: 20,
    },
    error: {
      color: "red",
    },
    containerButton: {
      width: 500,
      marginVertical: 10,
      marginHorizontal: 50,
      alignSelf: "center",
      marginBottom: 20,
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
  });

  const renderLayout = () => (
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
                  <DynamicForm fields={[field]} onChange={handleFieldChange} />
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
    <ScrollView style={styles.container}>
      <Text style={styles.sectionHead}>{form.formName}</Text>
      {renderLayout()}
      <Button
        title="Submit"
        onPress={handleSubmit}
        containerStyle={styles.containerButton}
      />
    </ScrollView>
  );
};

export default ViewFormScreen;
