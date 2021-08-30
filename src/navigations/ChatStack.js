import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ChatScreen from "../components/Screens/Chat/ChatScreen/ChatScreen";
import ConvoScreen from "../components/Screens/Chat/ConvoScreen/ConvoScreen";
import { VideoChat } from "../components/Screens/Chat/Calls/VideoChat/VideoChat";
import { AudioChat } from "../components/Screens/Chat/Calls/AudioChat/AudioChat";

const Stack = createStackNavigator();

const ChatStack = () => {
  return (
    <Stack.Navigator initialRouteName={"ChatScreen"}>
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        //options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ConvoScreen"
        component={ConvoScreen}
        //options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AudioChat"
        component={AudioChat}
        options={{ headerShown: false }}
        mode="modal"
      />
      <Stack.Screen
        name="VideoChat"
        component={VideoChat}
        options={{ headerShown: false }}
        mode="modal"
      />
    </Stack.Navigator>
  );
};

export default ChatStack;

//const styles = StyleSheet.create({})
