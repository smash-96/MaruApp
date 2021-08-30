import React, { useState, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SelectLanguage from "../components/Screens/Language/SelectLanguage";
import Login from "../components/Screens/Login/Login";
import Signup from "../components/Screens/Signup/Signup";
import MapStack from "./MapStack";
import { createStackNavigator } from "@react-navigation/stack";
import { auth, db } from "../firebase/firebaseConfig";
import SplashScreen from "../components/Screens/SplashScreen/SplashScreen";
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
  // const [FirstLanched, setFirstLaunched] = useState(null);
  let routeName = "SelectLanguage";

  // // Runs everytime the component is mounted
  // useEffect(() => {
  //   AsyncStorage.getItem("alreadyLaunched").then((value) => {
  //     if (value == null) {
  //       AsyncStorage.setItem("alreadyLaunched", "true");
  //       setFirstLaunched(true);
  //     } else {
  //       setFirstLaunched(false);
  //     }
  //   });
  // }, []);

  // if (FirstLanched === null) {
  //   return null;
  // } else if (FirstLanched === true) {
  //   routeName = "SelectLanguage";
  // } else {
  //   routeName = "Login";
  // }

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const docData = await db
        .collection("Users")
        .doc(auth?.currentUser?.uid)
        .get();
      const userPhoto = docData.data()?.photoUrl;
      const userType = docData.data()?.userType;
      const userFname = docData.data()?.fname;
      const userLname = docData.data()?.lname;
      const userEmail = docData.data()?.email;
      const userAddress = docData.data()?.Address;
      const userGender = docData.data()?.Gender;
      const userAge = docData.data()?.Age;
      if (userPhoto) {
        dispatch(setUserPhoto(userPhoto));
      }
      if (userType) {
        dispatch(setUserType(userType));
      } else {
        dispatch(setUserType(""));
      }
      if (userGender) {
        dispatch(setUserGender(userGender));
      } else {
        dispatch(setUserGender(""));
      }

      if (userFname) {
        dispatch(setUserFname(userFname));
      }
      if (userLname) {
        dispatch(setUserLname(userLname));
      }
      if (userEmail) {
        dispatch(setUserEmail(userEmail));
      }
      if (userAddress) {
        dispatch(setUserAddress(userAddress));
      }

      if (userAge) {
        dispatch(setUserAge(userAge));
      }

      setIsLoading(false);
    };

    if (auth?.currentUser) {
      getData();
    } else {
      setIsLoading(false);
    }
  }, [isLoading]);

  if (isLoading) {
    // We haven't finished checking for the token yet
    return <SplashScreen />;
  }

  return (
    <SafeAreaProvider>
      <Stack.Navigator>
        <Stack.Screen
          name="SelectLanguage"
          component={SelectLanguage}
          options={{ headerShown: false }}
        />
        {/* {(auth && (
          <>
            <Stack.Screen
              name="MapStack"
              component={MapStack}
              options={{ headerShown: false }}
            />
          </>
        )) || (
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
        )} */}
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
      </Stack.Navigator>
    </SafeAreaProvider>
  );
}
