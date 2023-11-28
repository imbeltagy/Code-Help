import { createSlice } from "@reduxjs/toolkit";

const savedData = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));

const initialState = Boolean(savedData)
  ? {
      isLogged: true,
      userMainInfo: {
        id: savedData.id,
        username: savedData.username,
        displayName: savedData.displayName,
        userState: savedData.userState,
      },
    }
  : {
      isLogged: false,
      userMainInfo: null,
    };

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      const { id, username, displayName, userState, rememberMe } = action.payload;
      state.isLogged = true;
      state.userMainInfo = { id, username, displayName, userState };

      // Save Data On The Browser
      const userData = JSON.stringify({ id, username, displayName, userState });
      rememberMe ? localStorage.setItem("user", userData) : sessionStorage.setItem("user", userData);
    },
    logout: (state) => {
      state.isLogged = false;
      state.userMainInfo = null;
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
