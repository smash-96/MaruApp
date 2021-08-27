import React, { useState, useLayoutEffect } from "react";
//import { StyleSheet, Text, View } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import MapScreen from "../components/Screens/Maps/MapScreen";
import ProfileScreen from "../components/Screens/Profile/ProfileScreen";
import SettingScreen from "../components/Screens/Settings/SettingScreen";
//import { ChatScreen } from "../components/Screens/Chat/ChatScreen/ChatScreen";
import UserAvatar from "../components/Custom/UserAvatar/UserAvatar";
import { useSelector } from "react-redux";
import { selectUserPhoto } from "../slices/userInfoSlice";
import ChatStack from "./ChatStack";

function CustomDrawerContent(props) {
  const userPhoto = useSelector(selectUserPhoto);
  const baseAvatar =
    "https://www.iosapptemplates.com/wp-content/uploads/2019/06/empty-avatar.jpg";
  const [profilePic, setProfilePic] = useState(baseAvatar || "");

  useLayoutEffect(() => {
    if (userPhoto !== null) {
      setProfilePic(userPhoto);
    }
  }, [userPhoto, profilePic]);
  return (
    <DrawerContentScrollView {...props}>
      <UserAvatar profilePic={profilePic} drawer={true} />
      <DrawerItemList {...props} />
      <DrawerItem
        label="Logout"
        //onPress={() => props.navigation.toggleDrawer()}
      />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();

const MapStack = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: "white",
        },
      }}
    >
      <Drawer.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ unmountOnBlur: true }}
      />
      <Drawer.Screen
        name="MapScreen"
        component={MapScreen}
        options={{ headerShown: false }}
      />

      <Drawer.Screen
        name="Messages"
        component={ChatStack}
        options={{ headerShown: false }}
      />

      <Drawer.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
};

export default MapStack;

//const styles = StyleSheet.create({});
