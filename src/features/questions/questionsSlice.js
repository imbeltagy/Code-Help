import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modalId: null,
  editorId: null,
  viewedQuestions: {},
  viewedQuestionsKeys: [],
};

export const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.modalId = action.payload;
    },
    closeModal: (state) => {
      state.modalId = null;
    },
    openEditor: (state, action) => {
      state.editorId = action.payload;
    },
    closeEditor: (state) => {
      state.editorId = null;
    },
    // Actions For Viewed Questions
    pushQuestion: (state, action) => {
      // Takes QuestionID and QuestionData without Answers
      if (state.viewedQuestionsKeys.includes(action.payload.id)) {
        state.viewedQuestions[action.payload.id] = {
          ...state.viewedQuestions[action.payload.id],
          ...action.payload.data,
        };
      } else {
        state.viewedQuestions[action.payload.id] = {
          ...state.viewedQuestions,
          [action.payload.id]: { ...action.payload.data, answers: {} },
        };
        state.viewedQuestionsKeys.push(action.payload.id);
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
    clearViewQuestions: (state) => {
      state.viewedQuestions = {};
      state.viewedQuestionsKeys = [];
    },
  },
});

export const {
  openModal,
  closeModal,
  openEditor,
  closeEditor,
  pushQuestion,
  pushAnswers,
  toggleSavedState,
  clearViewQuestions,
} = questionsSlice.actions;

export default questionsSlice.reducer;
