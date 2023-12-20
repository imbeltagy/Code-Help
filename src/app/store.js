import { configureStore } from "@reduxjs/toolkit";
import drawerReducer from "/src/features/drawer/drawerSlice";
import themeReducer from "/src/features/theme/themeSlice";
import userReducer from "/src/features/user/userSlice";
import questionsSlice from "/src/features/questions/questionsSlice";
import friendshipActionsReducer from "/src/features/friendshipActions/friendshipActionsSlice";

export const store = configureStore({
  reducer: {
    drawer: drawerReducer,
    theme: themeReducer,
    user: userReducer,
    friendshipActions: friendshipActionsReducer,
  },
});
