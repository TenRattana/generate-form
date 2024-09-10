import { createSlice } from "@reduxjs/toolkit";

const initialState = { subForms: [] };
const sort = (data) => {
  data.sort(
    (a, b) => parseInt(a.displayOrder, 10) - parseInt(b.displayOrder, 10)
  );
};

const subFormSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setSubForm: (state, action) => {
      const { subForms } = action.payload;

      state.subForms = subForms.map((sub) => ({
        subFormName: sub.subFormName,
        subFormId: sub.subFormId,
        formId: sub.formId,
        columns: parseInt(sub.columns, 10),
        displayOrder: parseInt(sub.displayOrder, 10),
        fields: [],
      }));
    },
    setField: (state, action) => {
      const { formState, checkList, checkListType } = action.payload;

      state.subForms.forEach((sub, index) => {
        const matchingForm = formState.filter(
          (form) => form.field.subFormId === sub.subFormId
        );

        if (matchingForm) {
          const update = matchingForm.map((v) => ({
            ...v.field,
            CheckListName:
              checkList.find((item) => item.CListID === v.field.checkListId)
                ?.CListName || "",
            CheckListTypeName:
              checkListType.find(
                (item) => item.CTypeID === v.field.checkListTypeId
              )?.CTypeName || "",
          }));
          state.subForms[index].fields = update;
        }
      });
    },

    addSubForm: (state, action) => {
      const { subForm } = action.payload;
      const parseColumns = parseInt(subForm.columns, 10);
      const parseDisplayOrder = parseInt(subForm.displayOrder, 10);

      state.subForms.push({
        subFormName: subForm.subFormName,
        subFormId: subForm.subFormId,
        formId: subForm.formId,
        columns: parseColumns,
        displayOrder: parseDisplayOrder,
        fields: [],
      });
    },
    updateSubForm: (state, action) => {
      const { subForm, selectedSubFormIndex } = action.payload;
      const parseColumns = parseInt(subForm.columns, 10);
      const parseDisplayOrder = parseInt(subForm.displayOrder, 10);

      state.subForms[selectedSubFormIndex] = {
        ...state.subForms[selectedSubFormIndex],
        subFormName: subForm.subFormName,
        subFormId: subForm.subFormId,
        formId: subForm.formId,
        columns: parseColumns,
        displayOrder: parseDisplayOrder,
      };
    },
    deleteSubForm: (state, action) => {
      const { selectedSubFormIndex } = action.payload;
      state.subForms.splice(selectedSubFormIndex, 1);
    },
    addField: (state, action) => {
      const { formState, selectedSubFormIndex, checkList, checkListType } =
        action.payload;

      if (state.subForms[selectedSubFormIndex]) {
        state.subForms[selectedSubFormIndex].fields = [
          ...state.subForms[selectedSubFormIndex].fields,
          {
            ...formState,
            CheckListName:
              checkList.find((v) => v.CListID === formState.checkListId)
                ?.CListName || "",
            CheckListTypeName:
              checkListType.find((v) => v.CTypeID === formState.checkListTypeId)
                ?.CTypeName || "",
          },
        ];
        sort(state.subForms[selectedSubFormIndex].fields);
      }
    },

    updateField: (state, action) => {
      const {
        formState,
        selectedSubFormIndex,
        selectedFieldIndex,
        checkList,
        checkListType,
      } = action.payload;

      if (
        state.subForms[selectedSubFormIndex] &&
        state.subForms[selectedSubFormIndex].fields[selectedFieldIndex]
      ) {
        state.subForms[selectedSubFormIndex].fields[selectedFieldIndex] = {
          ...formState,
          CheckListName:
            checkList.find((v) => v.CListID === formState.checkListId)
              ?.CListName || "",
          CheckListTypeName:
            checkListType.find((v) => v.CTypeID === formState.checkListTypeId)
              ?.CTypeName || "",
        };
        sort(state.subForms[selectedSubFormIndex].fields);
      }
    },

    deleteField: (state, action) => {
      const { selectedSubFormIndex, selectedFieldIndex } = action.payload;

      if (state.subForms[selectedSubFormIndex]) {
        state.subForms[selectedSubFormIndex].fields = state.subForms[
          selectedSubFormIndex
        ].fields.filter((_, index) => index !== selectedFieldIndex);
      }
    },
    reset: (state, action) => {
      state = initialState;
    },
  },
});

export const {
  setSubForm,
  setField,
  addSubForm,
  updateSubForm,
  deleteSubForm,
  addField,
  updateField,
  deleteField,
  reset,
} = subFormSlice.actions;
export default subFormSlice.reducer;

console.log("slices/forms");
