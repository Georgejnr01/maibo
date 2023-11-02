import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: {},
  isVerifying: true,
  isVerified: false,
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = {};
    },
    invalid: (state) => {
      state.isVerifying = false;
    },
    verified: (state) => {
      state.isVerified = true;
      state.isVerifying = false;
    },
  },
});

export const { login, logout, invalid, verified } = AuthSlice.actions;
export default AuthSlice.reducer;
