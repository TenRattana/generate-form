import { configureStore } from "@reduxjs/toolkit";
import counterSubForm from "../slices/forms/counterSubForm";
import couterField from "../slices/forms/couterField";

export const store = configureStore({
  reducer: {
    subForm: counterSubForm,
    field: couterField,
  },
});
console.log("store");
