import { createSlice } from "@reduxjs/toolkit";

const initialState = { fields: [] };

const fieldSlice = createSlice({
  name: "fields",
  initialState,
  reducers: {
    addField(state, action) {
      const {
        formState,
        selectedSubFormIndex,
        checkListType,
        checkList,
        matchCheckListOption,
      } = action.payload;
      console.log(action);

      if (state.subForms[selectedSubFormIndex]) {
        const newField = {
          ...formState,
          CheckListTypeName:
            checkListType.find((v) => v.CTypeID === formState.checkListTypeId)
              ?.CTypeName || "",
          CheckListName:
            checkList.find((v) => v.CListID === formState.checkListId)
              ?.CListName || "",
          MatchCheckListOption:
            matchCheckListOption.find(
              (v) => v.MCLOptionID === formState.matchCheckListOptionId
            )?.MCLOptionName || [],
        };

        state.subForms[selectedSubFormIndex].fields = [
          ...state.subForms[selectedSubFormIndex].fields,
          newField,
        ].sort(
          (a, b) => parseInt(a.displayOrder, 10) - parseInt(b.displayOrder, 10)
        );
      }
    },

    updateField(state, action) {
      const {
        formState,
        selectedSubFormIndex,
        selectedFieldIndex,
        checkListType,
        checkList,
        matchCheckListOption,
      } = action.payload;

      if (
        state.subForms[selectedSubFormIndex] &&
        state.subForms[selectedSubFormIndex].fields[selectedFieldIndex]
      ) {
        state.subForms[selectedSubFormIndex].fields[selectedFieldIndex] = {
          ...formState,
          CheckListTypeName:
            checkListType.find((v) => v.CTypeID === formState.checkListTypeId)
              ?.CTypeName || "",
          CheckListName:
            checkList.find((v) => v.CListID === formState.checkListId)
              ?.CListName || "",
          MatchCheckListOption:
            matchCheckListOption.find(
              (v) => v.MCLOptionID === formState.matchCheckListOptionId
            )?.MCLOptionName || [],
        };
      }
    },

    deleteField(state, action) {
      const { selectedSubFormIndex, selectedFieldIndex } = action.payload;

      if (state.subForms[selectedSubFormIndex]) {
        state.subForms[selectedSubFormIndex].fields = state.subForms[
          selectedSubFormIndex
        ].fields.filter((_, index) => index !== selectedFieldIndex);
      }
    },
  },
});

export const { addField, updateField, deleteField } = fieldSlice.actions;
export default fieldSlice.reducer;
