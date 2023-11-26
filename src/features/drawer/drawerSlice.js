import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
};

export const drawerSlice = createSlice({
  name: "drawer",
  initialState,
  reducers: {
    open: (state) => {
      state.isOpen = true;
    },
    close: (state) => {
      state.isOpen = false;
    },
  },
});

export const { open, close } = drawerSlice.actions;

export default drawerSlice.reducer;
