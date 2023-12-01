import { createSlice } from "@reduxjs/toolkit";

const savedUsername = localStorage.getItem("user") || sessionStorage.getItem("user");

const initialState = Boolean(savedUsername)
  ? {
      isLogged: true,
      username: savedUsername,
    }
  : {
      isLogged: false,
      username: null,
    };

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, { payload: { username, remember } }) => {
      state.isLogged = true;
      state.username = username;

      // Save Data On The Browser
      remember ? localStorage.setItem("user", username) : sessionStorage.setItem("user", username);
    },
    logout: (state) => {
      state.isLogged = false;
      state.username = null;
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
