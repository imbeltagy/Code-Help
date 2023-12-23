import { configureStore } from "@reduxjs/toolkit";
import drawerReducer from "/src/features/drawer/drawerSlice";
import themeReducer from "/src/features/theme/themeSlice";
import userReducer from "/src/features/user/userSlice";
import questionsReducer from "/src/features/questions/questionsSlice";
import friendshipActionsReducer from "/src/features/friendshipActions/friendshipActionsSlice";
import notificationReducer from "/src/features/notification/notificationSlice";

export const store = configureStore({
  reducer: {
    drawer: drawerReducer,
    theme: themeReducer,
    user: userReducer,
    questions: questionsReducer,
    friendshipActions: friendshipActionsReducer,
    notification: notificationReducer,
  },
});
