import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  message: "This is a notification.",
  type: "success",
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    open: (state, { payload: { message, type } }) => {
      state.isOpen = true;
      state.message = message;
      state.type = type;
    },
    close: (state) => {
      state.isOpen = false;
    },
  },
});

export const { open, close } = notificationSlice.actions;

export default notificationSlice.reducer;
