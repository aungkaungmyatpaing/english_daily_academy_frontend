import { configureStore, createSlice } from "@reduxjs/toolkit";

const mainLoadingSlice = createSlice({
  name: "mainLoading",
  initialState: {
    mainLoading: true,
    checkoutFormValidated: false,
    checkoutDone: false,
  },
  reducers: {
    setMainLoading: (state, action) => {
      state.mainLoading = action.payload;
    },
    setCheckoutFormValidated: (state, action) => {
      state.checkoutFormValidated = action.payload; // New reducer for the new state
    },
    setCheckoutDone: (state, action) => {
      state.checkoutDone = action.payload; // New reducer for the new state
    },
  },
});

export const { setMainLoading, setCheckoutFormValidated, setCheckoutDone } =
  mainLoadingSlice.actions;

const store = configureStore({
  reducer: {
    mainLoading: mainLoadingSlice.reducer,
  },
});

export default store;
