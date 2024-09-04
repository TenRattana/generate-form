import { configureStore } from "@reduxjs/toolkit";
import counterForm from "../features/crades/cardsSlice";

const store = configureStore({
  reducer: {
    form: counterForm,
  },
});

export default store;
