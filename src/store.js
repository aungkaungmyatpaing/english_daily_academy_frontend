import { configureStore, createSlice } from "@reduxjs/toolkit";

const mainLoadingSlice = createSlice({
  name: "mainLoading",
  initialState: true,
  reducers: {
    setMainLoading: (state, action) => action.payload,
  },
});

export const { setMainLoading } = mainLoadingSlice.actions;

const store = configureStore({
  reducer: {
    mainLoading: mainLoadingSlice.reducer,
  },
});

export default store;
