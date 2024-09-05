import { createSlice } from "@reduxjs/toolkit";

const initialState = { subForms: [] };

const subFormSlice = createSlice({
  name: "sform",
  initialState,
  reducers: {
    setSubForm(state, action) {
      const subForm = action.payload.subForm;
      state.subForms = subForm.map((sub) => ({
        subFormName: sub.subFormName,
        subFormId: subForm.subFormId,
        formId: subForm.formId,
        columns: parseInt(sub.columns, 10),
        displayOrder: parseInt(sub.displayOrder, 10),
        fields: [],
      }));
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
    updateSubForm(state, action) {
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
    deleteSubForm(state, action) {
      const { selectedSubFormIndex } = action.payload;
      state.subForms.splice(selectedSubFormIndex, 1);
    },
  },
});

export const { setSubForm, addSubForm, updateSubForm, deleteSubForm } =
  subFormSlice.actions;
export default subFormSlice.reducer;

console.log("slices/forms");
