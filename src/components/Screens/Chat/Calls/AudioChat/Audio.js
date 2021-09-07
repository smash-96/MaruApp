import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MediaStream, RTCView } from "react-native-webrtc";
import { Avatar } from "react-native-elements";

function ButtonContainer(props) {
  return (
    <View style={styles.btnContainer}>
      <TouchableOpacity
        onPress={props.hangup}
        style={{ backgroundColor: "red", marginRight: 30 }}
        activeOpacity={0.5}
      >
        <Avatar
          rounded
          source={{
            uri: "https://cdn.icon-icons.com/icons2/2440/PNG/512/phone_call_icon_148513.png",
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={props.toggleSpeaker}
        style={{ backgroundColor: "grey", marginRight: 30 }}
        activeOpacity={0.5}
      >
        <Avatar
          rounded
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Speaker_Icon.svg/600px-Speaker_Icon.svg.png",
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={props.toggleMute}
        style={{ backgroundColor: "grey", marginRight: 30 }}
        activeOpacity={0.5}
      >
        <Avatar
          rounded
          source={{
            uri: "https://static.thenounproject.com/png/2313-200.png",
          }}
        />
      </TouchableOpacity>
    </View>
  );
}
export const Audio = (props) => {
  // On Call we will display the local stream
  if (props.localStream && !props.remoteStream) {
    return (
      <View style={styles.container}>
        <ButtonContainer
          hangup={props.hangup}
          toggleSpeaker={props.toggleSpeaker}
          toggleMute={props.toggleMute}
        />
      </View>
    );
  }
  // Once call is connected, we'll display local stream on top of remote stream
  if (props.localStream && props.remoteStream) {
    return (
      <View style={styles.container}>
        <ButtonContainer
          hangup={props.hangup}
          toggleSpeaker={props.toggleSpeaker}
          toggleMute={props.toggleMute}
        />
      </View>
    );
  }
  <ButtonContainer hangup={props.hangup} />;
};

const styles = StyleSheet.create({
  btnContainer: {
    flexDirection: "row",
    bottom: 30,
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "yellow",
  },
  video: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  videoLocal: {
    position: "absolute",
    width: 100,
    height: 150,
    top: 0,
    left: 20,
    elevation: 10,
  },
});
