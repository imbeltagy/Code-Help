import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  viewedQuestions: {},
  keys: [],
};

export const viewedQuestionsSlice = createSlice({
  name: "viewedQuestions",
  initialState,
  reducers: {
    pushQuestion: (state, action) => {
      // Takes QuestionID and QuestionData without Answers
      if (state.keys.includes(action.payload.id)) {
        state.viewedQuestions[action.payload.id] = {
          ...state.viewedQuestions[action.payload.id],
          ...action.payload.data,
        };
      } else {
        state.viewedQuestions = {
          ...state.viewedQuestions,
          [action.payload.id]: { ...action.payload.data, answers: {} },
        };
        state.keys.push(action.payload.id);
      }
    },
    pushAnswers: (state, action) => {
      // Takes QuestionID and Object of Answers
      // Merge Answers Without Duplicating
      state.viewedQuestions[action.payload.id].answers = {
        ...state.viewedQuestions[action.payload.id].answers,
        ...action.payload.data,
      };
    },
    toggleSavedState: (state, action) => {
      // Takes QuestionID
      state.viewedQuestions[action.payload.id].isSaved = !state.viewedQuestions[action.payload.id].isSaved;
    },
    clear: (state) => {
      state.viewedQuestions = {};
      state.keys = [];
    },
  },
});

export const { pushQuestion, pushAnswers, toggleSavedState, clear } = viewedQuestionsSlice.actions;

export default viewedQuestionsSlice.reducer;
