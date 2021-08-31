import React, { useState, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SelectLanguage from "../components/Screens/Language/SelectLanguage";
import Login from "../components/Screens/Login/Login";
import Signup from "../components/Screens/Signup/Signup";
import LoadScreen from "../components/Screens/LoadScreen/LoadScreen";
import MapStack from "./MapStack";
import { createStackNavigator } from "@react-navigation/stack";
import { auth, db } from "../firebase/firebaseConfig";
import SplashScreen from "../components/Screens/SplashScreen/SplashScreen";
//import * as SplashScreen from "expo-splash-screen";
//import AsyncStorage from "@react-native-async-storage/async-storage";

import { useDispatch } from "react-redux";
import {
  setUserType,
  setUserPhoto,
  setUserFname,
  setUserLname,
  setUserEmail,
  setUserAddress,
  setUserGender,
  setUserAge,
} from "../slices/userInfoSlice";

const Stack = createStackNavigator();

export default function AuthStack(props) {
  // const dispatch = useDispatch();
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   const getData = async () => {
  //     try {
  //       //await SplashScreen.preventAutoHideAsync();
  //       const docData = await db
  //         .collection("Users")
  //         .doc(auth?.currentUser?.uid)
  //         .get();
  //       const userPhoto = docData.data()?.photoUrl;
  //       const userType = docData.data()?.userType;
  //       const userFname = docData.data()?.fname;
  //       const userLname = docData.data()?.lname;
  //       const userEmail = docData.data()?.email;
  //       const userAddress = docData.data()?.Address;
  //       const userGender = docData.data()?.Gender;
  //       const userAge = docData.data()?.Age;
  //       if (userPhoto) {
  //         dispatch(setUserPhoto(userPhoto));
  //       }
  //       if (userType) {
  //         dispatch(setUserType(userType));
  //       } else {
  //         dispatch(setUserType(""));
  //       }
  //       if (userGender) {
  //         dispatch(setUserGender(userGender));
  //       } else {
  //         dispatch(setUserGender(""));
  //       }

  //       if (userFname) {
  //         dispatch(setUserFname(userFname));
  //       }
  //       if (userLname) {
  //         dispatch(setUserLname(userLname));
  //       }
  //       if (userEmail) {
  //         dispatch(setUserEmail(userEmail));
  //       }
  //       if (userAddress) {
  //         dispatch(setUserAddress(userAddress));
  //       }

  //       if (userAge) {
  //         dispatch(setUserAge(userAge));
  //       }

  //       //await new Promise((resolve) => setTimeout(resolve, 2000));
  //     } catch (err) {
  //       console.warn(err);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   getData();
  // }, []);

  // if (isLoading) {
  //   // We haven't finished checking for the token yet
  //   return <SplashScreen />;

  //   //SplashScreen.hideAsync();
  // }

  return (
    <SafeAreaProvider>
      <Stack.Navigator
        screenOptions={{ animationEnabled: false, headerShown: false }}
        initialRouteName="LoadScreen"
      >
        <Stack.Screen
          name="LoadScreen"
          component={LoadScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="SelectLanguage"
          component={SelectLanguage}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MapStack"
          component={MapStack}
          options={{ headerShown: false }}
        />

        {/* {isUser === null ? (
          <>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{
                headerShown: false,
                animationTypeForReplace: auth ? "push" : "pop",
              }}
            />
            <Stack.Screen
              name="Signup"
              component={Signup}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <Stack.Screen
            name="MapStack"
            component={MapStack}
            options={{ headerShown: false }}
          />
        )} */}
      </Stack.Navigator>
    </SafeAreaProvider>
  );
}
