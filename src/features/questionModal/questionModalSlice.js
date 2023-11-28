import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  questionId: null,
};

export const questionModalSlice = createSlice({
  name: "questionModal",
  initialState,
  reducers: {
    open: (state, action) => {
      state.questionId = action.payload;
    },
    close: (state) => {
      state.questionId = null;
    },
  },
});

export const { open, close } = questionModalSlice.actions;

export default questionModalSlice.reducer;
