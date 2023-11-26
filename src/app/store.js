import { configureStore } from "@reduxjs/toolkit";
import drawerReducer from "/src/features/drawer/drawerSlice";
import themeReducer from "/src/features/theme/themeSlice";

export const store = configureStore({
  reducer: {
    drawer: drawerReducer,
    theme: themeReducer,
  },
});
