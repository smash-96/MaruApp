import React from "react";
import { View } from "react-native";
import IMAVCallContainerView from "./IMAVCallContainerView/IMAVCallContainerView";
import FlashMessage from "react-native-flash-message";

const IMAVAppCallWrapper = (MainComponent) => {
  const Component = (props) => {
    return (
      <View style={{ flex: 1 }}>
        <MainComponent />
        <IMAVCallContainerView />
        <FlashMessage position="top" />
      </View>
    );
  };
  return Component;
};

export default IMAVAppCallWrapper;
