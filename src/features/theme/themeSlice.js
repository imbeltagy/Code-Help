import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    change: (state, action) => {
      state.mode = action.payload;
    },
  },
});

export const { change } = themeSlice.actions;

export default themeSlice.reducer;
