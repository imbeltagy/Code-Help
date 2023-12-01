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
    pushQuestion: (state, action) => {
      const id = action.payload.id;
      const data = action.payload.data;
      // If the question doesn't exist create an empty obj
      state.savedQuestions[id] = Boolean(state.savedQuestions[id]) ? state.savedQuestions[id] : {};
      state.keys[id] = state.keys[id] | id;
      // Add new props or update the old props
      // Takes QuestionID and QuestionData
      for (const key in action.payload.data) {
        state.savedQuestions[id][key] = data[key];
      }
      // if date still in milliseconds transfrom it to a string
      let date = state.savedQuestions[id].date;
      date == parseFloat(date) ? (state.savedQuestions[id].date = ms2stringDate(date)) : null;
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
