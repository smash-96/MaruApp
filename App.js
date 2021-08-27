// import "react-native-gesture-handler";
// import React from "react";
// import { View, Text, KeyboardAvoidingView, Platform } from "react-native";
// import { Provider } from "react-redux";
// import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import HomeScreen from "./code/screens/HomeScreen";
// import MapScreen from "./code/screens/MapScreen";
// import { store } from "./store";

// const Stack = createStackNavigator();

// export default function App() {
//   return (
//     <Provider store={store}>
//       <NavigationContainer>
//         <SafeAreaProvider>
//           <KeyboardAvoidingView
//             style={{ flex: 1 }}
//             behavior={Platform.OS === "ios" ? "padding" : "height"}
//             keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
//           >
//             <Stack.Navigator>
//               <Stack.Screen
//                 name="HomeScreen"
//                 component={HomeScreen}
//                 options={{ headerShown: false }}
//               />
//               <Stack.Screen
//                 name="MapScreen"
//                 component={MapScreen}
//                 options={{ headerShown: false }}
//               />
//             </Stack.Navigator>
//           </KeyboardAvoidingView>
//         </SafeAreaProvider>
//       </NavigationContainer>
//     </Provider>
//   );
// }

import "react-native-gesture-handler";
import React, { useEffect } from "react";
import AuthStack from "./src/navigations/AuthStack";
import { NavigationContainer } from "@react-navigation/native";
import { auth, db } from "./src/firebase/firebaseConfig";

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
} from "./src/slices/userInfoSlice";

const App = () => {
  const dispatch = useDispatch();

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
      if (userGender) {
        dispatch(setUserGender(userGender));
      }
      if (userAge) {
        dispatch(setUserAge(userAge));
      }
    };
    getData();
  }, []);
  return (
    <NavigationContainer>
      <AuthStack />
    </NavigationContainer>
  );
};

export default App;

// import React, { useState, useEffect } from "react";
// import { Platform, Text, View, StyleSheet } from "react-native";
// import * as Location from "expo-location";

// export default function App() {
//   const [location, setLocation] = useState(null);
//   const [errorMsg, setErrorMsg] = useState(null);

// useEffect(() => {
//   const unsubscribe = Location.requestForegroundPermissionsAsync()
//     .then((request) => {
//       console.log("request", request);
//       if (request.status === "granted") {
//         Location.getForegroundPermissionsAsync()
//           .then(async (value) => {
//             console.log("value", value);
//             if (value.status === "granted") {
//               Location.getCurrentPositionAsync({})
//                 .then((location) => {
//                   console.log("location", location);
//                   setLocation(location);
//                   setErrorMsg(null);
//                 })
//                 .catch((e3) => {
//                   console.log(e3);
//                   setErrorMsg("Failed to fetch current location");
//                 });
//             }
//           })
//           .catch((e2) => {
//             console.log(e2);
//             setErrorMsg("Permission to access location was denied2");
//           });
//       }
//     })
//     .catch((e1) => {
//       console.log(e1);
//       setErrorMsg("Permission to access location was denied1");
//     });

//   return unsubscribe;
// }, []);

//   // const checkPermission = async () => {
//   //   const hasPermission = await Location.requestForegroundPermissionsAsync();
//   //   if (hasPermission.status === "granted") {
//   //     const permission = await askPermission();
//   //     return permission;
//   //   }
//   //   return true;
//   // };
//   // const askPermission = async () => {
//   //   const permission = await Location.getForegroundPermissionsAsync();
//   //   return permission.status === "granted";
//   // };

//   let text = "Waiting..";
//   if (errorMsg) {
//     text = errorMsg;
//   } else if (location) {
//     text = JSON.stringify(location);
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.paragraph}>{text}</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 20,
//   },
//   paragraph: {
//     fontSize: 18,
//     textAlign: "center",
//   },
// });
