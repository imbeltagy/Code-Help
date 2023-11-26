import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLogged: false,
  userMainInfo: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      const { id, username, displayName, userState } = action.payload;
      state.isLogged = true;
      state.userMainInfo = { id, username, displayName, userState };
      localStorage.setItem("userId", id);
    },
    logout: (state) => {
      state.isLogged = false;
      state.userMainInfo = null;
      localStorage.removeItem("userId");
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
