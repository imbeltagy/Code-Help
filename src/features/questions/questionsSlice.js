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
      if (!state.keys.includes[id]) {
        state.keys.push(id);
        state.savedQuestions[id] = {};
      }

      // Add new props or update the old props
      // Takes QuestionID and QuestionData
      for (const key in data) {
        state.savedQuestions[id][key] = data[key];
      }

      // if date still in milliseconds transfrom it to a string
      let date = state.savedQuestions[id].date;
      date == parseFloat(date) ? (state.savedQuestions[id].date = ms2stringDate(date)) : null;
    },
    removeQuestion: (state, { payload }) => {
      delete state.savedQuestions[payload];
    },
    replaceQuestionId: (state, { payload: { oldId, newId } }) => {
      // Change SavedQuestions ID
      state.savedQuestions = {
        ...state.savedQuestions,
        [newId]: state.savedQuestions[oldId],
      };
      delete state.savedQuestions[oldId];

      // Change Keys ID
      state.keys = state.keys.map((key) => (key == oldId ? newId : key));
    },
    pushAnswers: (state, { payload: { questionId, answers } }) => {
      // Modify Date
      const modifiedAnswers = { ...answers };
      Object.keys(answers).forEach((key) => {
        let date = answers[key].date;
        date == parseFloat(date) ? (answers[key].date = ms2stringDate(date)) : null;
      });
      // Merge Answers Without Duplicating
      state.savedAnswers[questionId] = {
        ...modifiedAnswers,
        ...state.savedAnswers[questionId],
      };
    },
    replaceAnswerId: (state, { payload: { questionId, oldAnswerId, newAnswerId } }) => {
      state.savedAnswers[questionId] = {
        ...state.savedAnswers[questionId],
        [newAnswerId]: state.savedAnswers[questionId][oldAnswerId],
      };
      delete state.savedAnswers[questionId][oldAnswerId];
    },
    removeAnswer: (state, { payload: { questionId, answerId } }) => {
      delete state.savedAnswers[questionId][answerId];
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

export const {
  pushQuestion,
  pushAnswers,
  changeSavedState,
  changeSolvedState,
  replaceAnswerId,
  removeAnswer,
  replaceQuestionId,
  removeQuestion,
} = questionsSlice.actions;

export default questionsSlice.reducer;
