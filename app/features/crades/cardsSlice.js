import { createSlice } from "@reduxjs/toolkit";

const initialState = { cards: [] };

const cardsSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    setCrade(state, action) {
      const formCard = action.payload.formCard;
      state.cards = formCard.map((card) => ({
        cardName: card.cardName,
        cardColumns: parseInt(card.cardColumns, 10),
        cardDisplayOrder: parseInt(card.cardDisplayOrder, 10),
        fields: [],
      }));
    },
    addCrade(state, action) {
      const { formCard, selectedCardIndex } = action.payload;
      state.cards[selectedCardIndex] = {
        ...state.cards[selectedCardIndex],
        ...formCard,
        cardColumns: parseInt(formCard.cardColumns, 10),
        cardDisplayOrder: parseInt(formCard.cardDisplayOrder, 10),
      };
    },
    updateCrade(state, action) {
      const { formCard, selectedCardIndex } = action.payload;
      state.cards[selectedCardIndex] = {
        ...state.cards[selectedCardIndex],
        ...formCard,
        cardColumns: parseInt(formCard.cardColumns, 10),
        cardDisplayOrder: parseInt(formCard.cardDisplayOrder, 10),
      };
    },
    deleteCrade(state, action) {
      const { selectedCardIndex } = action.payload;
      state.cards.splice(selectedCardIndex, 1);
    },
    setField(state, action) {
      const { formState, listType, list, matchListDetail } = action.payload;
      state.cards.forEach((card, cardIndex) => {
        if (formState.some((field) => field.index === cardIndex)) {
          const updatedFields = formState
            .filter((field) => field.index === cardIndex)
            .map((field) => ({
              ...field.field,
              TypeName:
                listType.find((v) => v.TypeID === field.field.listTypeId)
                  ?.TypeName || "",
              ListName:
                list.find((v) => v.ListID === field.field.listId)?.ListName ||
                "",
              MatchListDetail:
                matchListDetail.find(
                  (v) => v.MLDetailID === field.field.matchListDetailId
                )?.MatchListDetail || [],
            }))
            .sort(
              (a, b) =>
                parseInt(a.displayOrder, 10) - parseInt(b.displayOrder, 10)
            );
          card.fields = [...card.fields, ...updatedFields];
        }
      });
    },
    addField(state, action) {
      const { formState, selectedCardIndex, listType, list, matchListDetail } =
        action.payload;
      if (state.cards[selectedCardIndex]) {
        const newField = {
          ...formState,
          TypeName:
            listType.find((v) => v.TypeID === formState.listTypeId)?.TypeName ||
            "",
          ListName:
            list.find((v) => v.ListID === formState.listId)?.ListName || "",
          MatchListDetail:
            matchListDetail.find(
              (v) => v.MLDetailID === formState.matchListDetailId
            )?.MatchListDetail || [],
        };
        state.cards[selectedCardIndex].fields = [
          ...state.cards[selectedCardIndex].fields,
          newField,
        ].sort(
          (a, b) => parseInt(a.displayOrder, 10) - parseInt(b.displayOrder, 10)
        );
      }
    },
    updateField(state, action) {
      const {
        formState,
        selectedCardIndex,
        selectedFieldIndex,
        listType,
        list,
        matchListDetail,
      } = action.payload;
      if (state.cards[selectedCardIndex]) {
        state.cards[selectedCardIndex].fields[selectedFieldIndex] = {
          ...formState,
          TypeName:
            listType.find((v) => v.TypeID === formState.listTypeId)?.TypeName ||
            "",
          ListName:
            list.find((v) => v.ListID === formState.listId)?.ListName || "",
          MatchListDetail:
            matchListDetail.find(
              (v) => v.MLDetailID === formState.matchListDetailId
            )?.MatchListDetail || [],
        };
      }
    },
    deleteField(state, action) {
      const { selectedCardIndex, selectedFieldIndex } = action.payload;
      if (state.cards[selectedCardIndex]) {
        state.cards[selectedCardIndex].fields.splice(selectedFieldIndex, 1);
      }
    },
    reset(state) {
      return initialState;
    },
  },
});

export const {
  setCrade,
  addCrade,
  updateCrade,
  deleteCrade,
  setField,
  addField,
  updateField,
  deleteField,
  reset,
} = cardsSlice.actions;

export default cardsSlice.reducer;
