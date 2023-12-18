import { createSlice } from "@reduxjs/toolkit";
import fetchApi from "/src/app/fetchApi/Index";

const savedUsername = localStorage.getItem("user") || sessionStorage.getItem("user");

const initialState = Boolean(savedUsername)
  ? {
      isLogged: true,
      username: savedUsername,
      isFetching: true,
    }
  : {
      isLogged: false,
      username: null,
      isFetching: false,
    };

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, { payload: { username, remember } }) => {
      // Save Data On The Browser
      remember ? localStorage.setItem("user", username) : sessionStorage.setItem("user", username);
      location.reload();
    },
    logout: (state) => {
      state.isLogged = false;
      state.username = null;
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
      location.reload();
    },
    setUserInfo: (state, action) => {
      const info = action.payload;
      state.displayName = info.display_name ? info.display_name : state.username;
      state.state = info.state;
      state.notificationsCount = info.notifications_count;
      state.friendsCount = info.friends_count;
      state.savedQuestionsCount = info.saved_questions_count;
      state.questions = info.user_questions;
      state.isFetching = false;
    },
  },
});

export const { login, logout, setUserInfo } = userSlice.actions;

// Thunk action creator to fetch user info after login
export const getUserInfo = (username) => async (dispatch, getState) => {
  const state = getState().user;
  if (state.isLogged) {
    try {
      const res = await fetchApi(`get_user_info?username=${username}`, "GET");
      if (res.success) {
        dispatch(setUserInfo(res.data.user_info)); // Dispatch the action to set user info in the state
      } else {
        // Handle API error
      }
    } catch (error) {
      // Handle fetch error
    }
  }
};

export default userSlice.reducer;
