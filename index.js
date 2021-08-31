import { registerRootComponent } from "expo";
import { NativeModules } from "react-native";
import React from "react";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store";
import messaging from "@react-native-firebase/messaging";
import RNCallKeep from "react-native-callkeep";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
const { LaunchManager } = NativeModules;

const options = {
  ios: {
    appName: "Casablanca Dreams",
  },
  android: {
    alertTitle: "Permissions required",
    alertDescription: "This application needs to access your phone accounts",
    cancelButton: "Cancel",
    okButton: "ok",
  },
};
//RNCallKeep.setup(options);

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Message handled in the background!", remoteMessage);

  // if (
  //   remoteMessage.data.type === "video" ||
  //   remoteMessage.data.type === "audio"
  // ) {
  //   presentIncomingCall(remoteMessage);
  // }
});

presentIncomingCall = async (remoteMessage) => {
  if (Platform.OS != "android") {
    return;
  }

  try {
    //   RNCallKeep.setup(options);
    RNCallKeep.setAvailable(true);

    RNCallKeep.addEventListener("answerCall", (body) =>
      onAnswerCallAction(body, remoteMessage.data)
    );

    const { callerID, calleeID, callerName } = remoteMessage.data;
    const uid = callerID + "_" + calleeID;
    console.log(uid, callerName);
    RNCallKeep.displayIncomingCall(uid, callerName, callerName);
  } catch (error) {
    console.log(error);
  }
};

onAnswerCallAction = async (body, data) => {
  await RNCallKeep.removeEventListener("endCall");
  console.log("onAnswerCallAction " + body.callUUID);
  RNCallKeep.rejectCall(body.callUUID);

  LaunchManager.openAppWithData(JSON.stringify(data));
};

const maruApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);
registerRootComponent(maruApp);
