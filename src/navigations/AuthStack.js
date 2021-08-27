import React, { useState, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SelectLanguage from "../components/Screens/Language/SelectLanguage";
import Login from "../components/Screens/Login/Login";
import Signup from "../components/Screens/Signup/Signup";
import MapStack from "./MapStack";
import { createStackNavigator } from "@react-navigation/stack";
//import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createStackNavigator();

export default function AuthStack(props) {
  // const [FirstLanched, setFirstLaunched] = useState(null);
  let routeName = "SelectLanguage";
  //let routeName = "Login";

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
  return (
    <SafeAreaProvider>
      <Stack.Navigator initialRouteName={routeName}>
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
      </Stack.Navigator>
    </SafeAreaProvider>
  );
}
