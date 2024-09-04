import React, {
  useState,
  useEffect,
  useReducer,
  useRef,
  useContext,
  useMemo,
} from "react";
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
import { ToastContext } from "../../contexts";
import { connect } from "react-redux";
import {
  setcrade,
  addcrade,
  updatecrade,
  deletecrade,
  setfield,
  addfield,
  updatefield,
  deletefield,
} from "../../actions";

const mapStateToProps = (state) => ({
  state: state.counter.count,
});

const FormBuilder = ({
  state: reduxState,
  setcrade,
  addcrade,
  updatecrade,
  deletecrade,
  setfield,
  addfield,
  updatefield,
  deletefield,
}) => {
  const [localState, dispatch] = useReducer(reducer, initial);
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
    mListId: "",
    listId: "",
    description: "",
    listTypeId: "",
    dataTypeId: "",
    displayOrder: "",
    placeholder: "",
    hint: "",
    require: false,
  });
  const [resetDropdown, setResetDropdown] = useState(false);
  const [list, setList] = useState([]);
  const [machine, setMachine] = useState([]);
  const [listDetail, setListDetail] = useState([]);
  const [matchListDetail, setMatchListDetail] = useState([]);
  const [listType, setListType] = useState([]);
  const [dataType, setDataType] = useState([]);
  const [formData, setFormData] = useState([]);
  const [form, setForm] = useState({
    mfmachineId: "",
    mFormId: "",
    formId: "",
    formName: "",
    formDescription: "",
  });
  const [shouldRender, setShouldRender] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { formIdforEdit, formIdMachine } = route.params || {};
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const { Toast } = useContext(ToastContext);

  const [messages, setMessages] = useState({
    color: "",
    messageLabel: "",
    messageTitle: [],
  });

  console.log("FormBuilder");

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
        setIsDataLoaded(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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
    if (isDataLoaded && (formIdforEdit || formIdMachine)) {
      const fetchFormData = async () => {
        const data = {
          FormID: formIdforEdit || "",
          MFMachineID: formIdMachine || "",
        };

        try {
          const listResponse = await axios.post("GetForm", data);
          const formData = listResponse.data.data;

          if (formData.length > 0) {
            const firstItem = formData[0];

            setForm({
              mfmachineId: firstItem.MFMachineID || "",
              mFormId: firstItem.MFormID || "",
              formId: firstItem.FormID || "",
              formName: firstItem.FormName || "",
              formDescription: firstItem.Description || "",
            });

            const cards = [];
            const fields = [];

            formData.forEach((item) => {
              const card = {
                cardName: item.CardName,
                cardColumns: item.Columns,
                cardDisplayOrder: item.DisplayOrder,
              };

              item.MatchListDetail.forEach((itemDetail) => {
                const field = {
                  matchListDetailId: itemDetail.MLDetailID,
                  listId: itemDetail.ListID,
                  mListId: itemDetail.MListID,
                  description: itemDetail.Description,
                  listTypeId: itemDetail.TypeID,
                  dataTypeId: itemDetail.DTypeID,
                  displayOrder: itemDetail.DisplayOrder,
                  placeholder: itemDetail.Placeholder,
                  hint: itemDetail.Hint,
                  require: false,
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
            setMessages({
              messageLabel: listResponse.data.status ? "Success" : "Error",
              messageTitle: [listResponse.data.message],
              color: listResponse.data.status ? "success" : "error",
            });
          }
        } catch (error) {
          setMessages({
            messageLabel: error.message,
            messageTitle: [...error.response.data.errors],
            color: colors.palette.danger,
          });
        }
      };
      fetchFormData();
    }
  }, [formIdforEdit, isDataLoaded, formIdMachine]);

  useEffect(() => {
    if (Toast && messages.messageLabel && messages.messageTitle.length > 0) {
      Toast.show({
        type: "customToast",
        text1: messages.messageLabel,
        text2: messages.messageTitle,
        props: { color: messages.color },
      });
    }
  }, [messages, Toast]);

  useEffect(() => {
    setForm({ formId: "", formName: "", formDescription: "" });
    dispatch({ type: "reset", payload: {} });
  }, [route.params]);

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

    if (errorMessage) {
      setError((prevErrors) => ({ ...prevErrors, [field]: errorMessage }));
      return false;
    }

    setError((prevErrors) => ({ ...prevErrors, [field]: "" }));
    return true;
  };

  const handleAddCard = () => {
    if (Object.values(formCard).some((value) => value === "")) {
      setError((prevErrors) => ({
        ...prevErrors,
        cardName: "Card Name is required.",
        cardColumns: "Card Columns is required.",
        cardDisplayOrder: "Card Display Order is required.",
      }));
      return;
    }

    setError({});
    // Handle card addition logic here
  };

  const handleSave = () => {
    // Implement save logic here
  };

  const handleReset = () => {
    // Implement reset logic here
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Form Builder</Text>
        </View>

        <FlatList
          data={reduxState}
          renderItem={({ item }) => <Text>{item.name}</Text>}
          keyExtractor={(item) => item.id}
        />

        <TouchableOpacity onPress={() => setShowCardDialog(true)}>
          <Text style={styles.buttonText}>Add Card</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowFieldDialog(true)}>
          <Text style={styles.buttonText}>Add Field</Text>
        </TouchableOpacity>

        <Dialog
          isVisible={showCardDialog}
          onBackdropPress={() => setShowCardDialog(false)}
        >
          <Dialog.Title title="Card Details" />
          <Input
            placeholder="Card Name"
            value={formCard.cardName}
            onChangeText={(value) => {
              setFormCard((prev) => ({ ...prev, cardName: value }));
              handleCard("cardName", value);
            }}
            errorMessage={error.cardName}
          />
          <Input
            placeholder="Card Columns"
            value={formCard.cardColumns}
            onChangeText={(value) => {
              setFormCard((prev) => ({ ...prev, cardColumns: value }));
              handleCard("cardColumns", value);
            }}
            errorMessage={error.cardColumns}
          />
          <Input
            placeholder="Card Display Order"
            value={formCard.cardDisplayOrder}
            onChangeText={(value) => {
              setFormCard((prev) => ({ ...prev, cardDisplayOrder: value }));
              handleCard("cardDisplayOrder", value);
            }}
            errorMessage={error.cardDisplayOrder}
          />
          <Button title="Add Card" onPress={handleAddCard} />
        </Dialog>

        <Dialog
          isVisible={showFieldDialog}
          onBackdropPress={() => setShowFieldDialog(false)}
        >
          <Dialog.Title title="Field Details" />
          {/* Add Field Dialog Implementation */}
        </Dialog>

        <Dialog
          isVisible={showSaveDialog}
          onBackdropPress={() => setShowSaveDialog(false)}
        >
          <Dialog.Title title="Save Form" />
          <Button title="Save" onPress={handleSave} />
          <Button title="Cancel" onPress={() => setShowSaveDialog(false)} />
        </Dialog>

        <TouchableOpacity onPress={handleReset}>
          <Text style={styles.buttonText}>Reset Form</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing[4],
    backgroundColor: colors.palette.background,
  },
  header: {
    paddingBottom: spacing[3],
  },
  title: {
    fontSize: fonts.size.h1,
    fontWeight: "bold",
  },
  buttonText: {
    fontSize: fonts.size.body,
    color: colors.palette.primary,
  },
});

export default connect(mapStateToProps, {
  setcrade,
  addcrade,
  updatecrade,
  deletecrade,
  setfield,
  addfield,
  updatefield,
  deletefield,
})(FormBuilder);
