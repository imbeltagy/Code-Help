import { configureStore } from "@reduxjs/toolkit";
import drawerReducer from "/src/features/drawer/drawerSlice";
import themeReducer from "/src/features/theme/themeSlice";
import userReducer from "/src/features/user/userSlice";
import questionsSlice from "/src/features/questions/questionsSlice";

export const store = configureStore({
  reducer: {
    drawer: drawerReducer,
    theme: themeReducer,
    user: userReducer,
    questions: questionsSlice,
  },
});
