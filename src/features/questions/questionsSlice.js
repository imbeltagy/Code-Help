import { createSlice } from "@reduxjs/toolkit";

function ms2stringDate(timestamp) {
  const now = Date.now();
  const seconds = Math.floor((now - timestamp) / 1000);
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      if (unit === "day") {
        const date = new Date(timestamp);
        const options = { day: "numeric", month: "long", year: "numeric" };
        return date.toLocaleDateString(undefined, options);
      } else {
        return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
      }
    }
  }

  return "just now";
}

const initialState = {
  savedQuestions: {},
  savedAnswers: {},
  keys: [],
};

export const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    pushQuestion: (state, { payload: { date: id, ...question } }) => {
      !state.keys.includes(id) ? (state.keys = [id, ...state.keys]) : null;
      state.savedQuestions[id] = { ...question, date: ms2stringDate(id) };
    },
    modifyQuestion: (state, { payload: { id, newData } }) => {
      state.savedQuestions[id] = {
        ...state.savedQuestions[id],
        ...newData,
      };
    },
    removeQuestion: (state, { payload: id }) => {
      delete state.savedQuestions[id];
    },
    pushAnswers: (state, { payload: { questionId, answers } }) => {
      const modifiedAnswers = { ...answers };

      // Convert Answers Date To String
      Object.keys(modifiedAnswers).forEach((key) => {
        modifiedAnswers[key].date = ms2stringDate(key);
      });

      // Merge Answers Without Duplicating
      state.savedAnswers[questionId] = {
        ...state.savedAnswers[questionId],
        ...modifiedAnswers,
      };
    },
    modifyAnswer: (state, { payload: { questionId, answerId, newData } }) => {
      state.savedAnswers[questionId][answerId] = {
        ...state.savedAnswers[questionId][answerId],
        ...newData,
      };
    },
    removeAnswer: (state, { payload: { questionId, answerId } }) => {
      delete state.savedAnswers[questionId][answerId];
    },
    clearAnswers: (state, { payload: questionId }) => {
      delete state.savedAnswers[questionId];
    },
    changeSavedState: (state, { payload: { id, newState } }) => {
      // Takes QuestionID and state(boolean)
      state.savedQuestions[id].isSaved = newState;
    },
    changeSolvedState: (state, { payload: { id, newState } }) => {
      // Takes QuestionID and state(boolean)
      state.savedQuestions[id].isSolved = newState;
    },
  },
});

export const {
  pushQuestion,
  modifyQuestion,
  removeQuestion,
  pushAnswers,
  modifyAnswer,
  removeAnswer,
  clearAnswers,
  changeSavedState,
  changeSolvedState,
} = questionsSlice.actions;

export default questionsSlice.reducer;
