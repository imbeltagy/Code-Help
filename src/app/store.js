import { configureStore } from "@reduxjs/toolkit";
import drawerReducer from "/src/features/drawer/drawerSlice";
import themeReducer from "/src/features/theme/themeSlice";
import userReducer from "/src/features/user/userSlice";
import questionModalSlice from "/src/features/questionModal/questionModalSlice";
import viewedQuestionsSlice from "/src/features/viewedQuestions/viewedQuestionsSlice";

export const store = configureStore({
  reducer: {
    drawer: drawerReducer,
    theme: themeReducer,
    user: userReducer,
    questionModal: questionModalSlice,
    viewedQuestions: viewedQuestionsSlice,
  },
});
