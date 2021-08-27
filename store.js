import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./src/slices/userInfoSlice"; // Get reducer

export const store = configureStore({
  reducer: {
    user: userReducer, // connect reducer to store
  },
});
