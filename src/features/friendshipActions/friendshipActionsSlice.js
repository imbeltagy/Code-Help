import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  disabled: false,
};

export const friendshipActionsSlice = createSlice({
  name: "friendshipActions",
  initialState,
  reducers: {
    disable: (state) => {
      state.disabled = true;
    },
    undisable: (state) => {
      state.disabled = false;
    },
  },
});

export const { disable, undisable } = friendshipActionsSlice.actions;

export default friendshipActionsSlice.reducer;
