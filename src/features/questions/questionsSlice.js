import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  savedQuestions: {},
  savedAnswers: {},
  keys: [],
};

export const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    pushQuestion: (state, action) => {
      // Takes QuestionID and QuestionData
      if (state.keys.includes(action.payload.id)) {
        // If Question Exist
        state.savedQuestions[action.payload.id] = {
          ...state.savedQuestions[action.payload.id],
          ...action.payload.data,
        };
      } else {
        state.savedQuestions[action.payload.id] = {
          ...action.payload.data,
        };
        state.savedAnswers[action.payload.id] = {};
        state.keys.push(action.payload.id);
      }
    },
    pushAnswers: (state, action) => {
      // Takes QuestionID and Object of Answers
      // Merge Answers Without Duplicating
      state.savedAnswers[action.payload.id] = {
        ...state.savedAnswers[action.payload.id],
        ...action.payload.data,
      };
    },
    changeSavedState: (state, action) => {
      // Takes QuestionID and state(boolean)
      state.savedQuestions[action.payload.id].isSaved = action.payload.state;
    },
    changeSolvedState: (state, action) => {
      // Takes QuestionID and state(boolean)
      state.savedQuestions[action.payload.id].isSolved = action.payload.state;
    },
  },
});

export const { pushQuestion, pushAnswers, changeSavedState, changeSolvedState } = questionsSlice.actions;

export default questionsSlice.reducer;
