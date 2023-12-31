import axios from "axios";
import { createSlice, createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const {
        data: { foundUser, encodedToken },
      } = await axios.post("/api/auth/login", credentials);
      axios.defaults.headers.common["authorization"] = encodedToken;

      return { foundUser, encodedToken };
    } catch (error) {
      return rejectWithValue("Email or password is incorrect");
    }
  }
);

export const signupUser = createAsyncThunk(
  "auth/signup",
  async (credentials, { rejectWithValue }) => {
    try {
      const {
        data: { createdUser, encodedToken },
      } = await axios.post("/api/auth/signup", credentials);
      axios.defaults.headers.common["authorization"] = encodedToken;

      return { createdUser, encodedToken };
    } catch (error) {
      if (error.response.status === 422) {
        return rejectWithValue("Username already exists!");
      }
      return rejectWithValue("Something is wrong, please try again.");
    }
  }
);

export const editLoggedInUser = createAsyncThunk(
  "auth/editLoggedInUser",
  async (userData, { rejectWithValue }) => {
    try {
      const {
        data: { user },
      } = await axios.post("/api/users/edit", { userData });

      return user;
    } catch (error) {
      return rejectWithValue("Could not edit the user data!");
    }
  }
);

export const logoutUser = createAction("auth/logoutUser");
export const persistUser = createAction("auth/persistUser");

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    error: "",
    isLoading: false,
    theme: localStorage.getItem("mybuddy-theme") || "light",
  },
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("mybuddy-theme", state.theme);
    },
  },
  extraReducers: {
    [persistUser]: (state) => {
      state.user = JSON.parse(localStorage.getItem("mybuddy-user")) ?? null;
      axios.defaults.headers.common["authorization"] =
        localStorage.getItem("mybuddy-token");
    },
    [logoutUser]: (state) => {
      state.user = null;
      localStorage.removeItem("mybuddy-user");
      localStorage.removeItem("mybuddy-token");
      delete axios.defaults.headers.common["authorization"];
    },
    [loginUser.pending]: (state) => {
      state.error = "";
      state.isLoading = true;
    },
    [loginUser.fulfilled]: (state, { payload }) => {
      state.error = "";
      state.isLoading = false;
      state.user = payload.foundUser;
      localStorage.setItem("mybuddy-token", payload.encodedToken);
      localStorage.setItem("mybuddy-user", JSON.stringify(payload.foundUser));
    },
    [loginUser.rejected]: (state, { payload }) => {
      state.error = payload;
      state.isLoading = false;
    },
    [signupUser.pending]: (state) => {
      state.error = "";
      state.isLoading = true;
    },
    [signupUser.fulfilled]: (state, { payload }) => {
      state.error = "";
      state.isLoading = false;
      state.user = payload.createdUser;
      localStorage.setItem("mybuddy-token", payload.encodedToken);
      localStorage.setItem("mybuddy-user", JSON.stringify(payload.createdUser));
    },
    [signupUser.rejected]: (state, { payload }) => {
      state.error = payload;
      state.isLoading = false;
    },
    [editLoggedInUser.pending]: (state) => {
      state.error = "";
      state.isLoading = true;
    },
    [editLoggedInUser.fulfilled]: (state, { payload }) => {
      state.isLoading = false;
      state.user = payload;
      localStorage.setItem("mybuddy-user", JSON.stringify(payload));
    },
  },
});

export const authReducer = authSlice.reducer;
export const { toggleTheme } = authSlice.actions;
export const useAuth = () => useSelector((state) => state.auth);
