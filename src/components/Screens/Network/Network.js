import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import NetInfo from "@react-native-community/netinfo";

const Network = () => {
  const [connected, setConnected] = useState(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
      if (state.isConnected) {
        setConnected(true);
      } else {
        setConnected(false);
      }
    });

    return unsubscribe;
  }, []);

  if (connected) {
    return null;
  }
  return (
    <View style={{ flex: 1 }}>
      <Text>Internet not avaialble!</Text>
    </View>
  );
};

export default Network;

const styles = StyleSheet.create({});
