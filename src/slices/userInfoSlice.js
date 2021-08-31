import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userType: null,
  userPhoto: null,
  userFname: null,
  userLname: null,
  userEmail: null,
  userAddress: null,
  userGender: null,
  userAge: null,
  userLocation: null,
  userLanguage: null,
  //
  helperLocation: null,
  helpeeLocation: null,
  connecting: false,
};

export const userInfoSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserType: (state, action) => {
      state.userType = action.payload;
    },
    setUserPhoto: (state, action) => {
      state.userPhoto = action.payload;
    },
    setUserFname: (state, action) => {
      state.userFname = action.payload;
    },
    setUserLname: (state, action) => {
      state.userLname = action.payload;
    },
    setUserEmail: (state, action) => {
      state.userEmail = action.payload;
    },
    setUserAddress: (state, action) => {
      state.userAddress = action.payload;
    },
    setUserGender: (state, action) => {
      state.userGender = action.payload;
    },
    setUserAge: (state, action) => {
      state.userAge = action.payload;
    },
    setUserLocation: (state, action) => {
      state.userLocation = action.payload;
    },
    setUserLanguage: (state, action) => {
      state.userLanguage = action.payload;
    },

    //
    setHelperLocation: (state, action) => {
      state.helperLocation = action.payload;
    },
    setHelpeeLocation: (state, action) => {
      state.helpeeLocation = action.payload;
    },
    setConnecting: (state, action) => {
      state.connecting = action.payload;
    },
  },
});

// Actions - used to set global state
export const {
  setUserType,
  setUserPhoto,
  setUserFname,
  setUserLname,
  setUserEmail,
  setUserAddress,
  setUserGender,
  setUserAge,
  setUserLocation,
  setUserLanguage,
  //
  setHelperLocation,
  setHelpeeLocation,
  setConnecting,
} = userInfoSlice.actions;

// Selectors - used to fetch global state
export const selectUserType = (state) => state.user.userType;
export const selectUserPhoto = (state) => state.user.userPhoto;
export const selectUserFname = (state) => state.user.userFname;
export const selectUserLname = (state) => state.user.userLname;
export const selectUserEmail = (state) => state.user.userEmail;
export const selectUserAddress = (state) => state.user.userAddress;
export const selectUserGender = (state) => state.user.userGender;
export const selectUserAge = (state) => state.user.userAge;
export const selectUserLocation = (state) => state.user.userLocation;
export const selectUserLanguage = (state) => state.user.userLanguage;
//
export const selectHelperLocation = (state) => state.user.helperLocation;
export const selectHelpeeLocation = (state) => state.user.helpeeLocation;
export const selectConnecting = (state) => state.user.connecting;

export default userInfoSlice.reducer;
