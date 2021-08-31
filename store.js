import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./src/slices/userInfoSlice"; // Get reducer

export const store = configureStore({
  reducer: {
    user: userReducer, // connect reducer to store
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware({
  //     immutableCheck: { ignoredPaths: ["some.nested.path"] },
  //     serializableCheck: { ignoredPaths: ["some.nested.path"] },
  //   }),
});
