import React, { useState, useLayoutEffect, useRef } from "react";
import { Avatar } from "react-native-elements";
import { SafeAreaProvider } from "react-native-safe-area-context";
import dynamic_styles from "./styles";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
} from "react-native";
import { auth, db } from "../../../../firebase/firebaseConfig";
import firestore from "@react-native-firebase/firestore";
// import {VideoChat} from '../Custom/VideoChat';
// import {AudioChat} from '../Custom/AudioChat';
// import {toggleCall} from '../../redux/actions/call';
// import {useDispatch, useSelector} from 'react-redux';
import { useNavigation } from "@react-navigation/native";

const ConvoScreen = (props) => {
  const navigation = useNavigation();
  const styles = dynamic_styles();

  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const scrollViewRef = useRef();

  //   // maps the component state to redux state
  //   const connecting = useSelector(state => state.callReducer.connecting);
  //   //

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chat",
      headerTitleAlign: "left",
      headerStyle: { backgroundColor: "#2c88d1" },
      headerTitleStyle: { color: "white" },
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Avatar
            rounded
            source={{
              uri: props.route.params.photo,
            }}
          />
          <Text
            style={{
              marginLeft: 10,
              fontWeight: "700",
              color: "white",
              fontSize: 16,
            }}
          >
            {props.route.params.fname} {props.route.params.lname}
          </Text>
        </View>
      ),
      headerLeft: () => (
        <View style={{ marginLeft: 20 }}>
          <TouchableOpacity
            onPress={() => {
              navigation.replace("ChatScreen");
            }}
            activeOpacity={0.5}
          >
            <Avatar
              rounded
              source={{
                uri: "https://img.icons8.com/ios/452/long-arrow-left.png",
              }}
            />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 80,
            marginRight: 20,
          }}
        >
          <TouchableOpacity onPress={audioCall} activeOpacity={0.5}>
            <Avatar
              rounded
              source={{
                uri: "https://cdn.icon-icons.com/icons2/2440/PNG/512/phone_call_icon_148513.png",
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={videoCall} activeOpacity={0.5}>
            <Avatar
              source={{
                uri: "https://img.icons8.com/ios/452/video-call.png",
              }}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]); // Update or reloads useEffect when dependent values are changed

  // For Caller
  const videoCall = () => {
    console.log("Video Call");
    props.navigation.navigate("VideoChat", {
      callType: "video",
      caller: auth?.currentUser?.uid,
      callee: props.route.params.uid,
    });
  };

  // For Caller
  const audioCall = () => {
    console.log("Audio Call");
    props.navigation.navigate("AudioChat", {
      callType: "audio",
      caller: auth?.currentUser?.uid,
      callee: props.route.params.uid,
    });
  };

  const chatID = () => {
    const chatterID = auth?.currentUser?.uid;
    const chateeID = props.route.params.uid;
    const chatIDpre = [];
    chatIDpre.push(chatterID);
    chatIDpre.push(chateeID);
    chatIDpre.sort();
    return chatIDpre.join("_");
  };

  const sendMessage = async () => {
    if (msg !== "") {
      Keyboard.dismiss();
      const currentTime = firestore.FieldValue.serverTimestamp();
      const msgRef = db.collection("messages").doc(chatID());

      await msgRef.collection("chats").add({
        timeStamp: currentTime,
        message: msg,
        senderID: auth?.currentUser?.uid,
        recieverID: props.route.params.uid,
      });
      setMsg("");

      await db
        .collection("Chats")
        .doc(props.route.params.uid)
        .collection("SelectedChats")
        .doc(auth?.currentUser?.uid)
        .update({
          lastMessageTime: currentTime,
        });
    }
  };

  useLayoutEffect(() => {
    const unsubscribe = db
      .collection("messages")
      .doc(chatID())
      .collection("chats")
      .orderBy("timeStamp", "desc")
      .onSnapshot((snapshot) => {
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      });

    return unsubscribe;
  }, [props.route]);

  return (
    <SafeAreaProvider>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <>
            <FlatList
              data={messages}
              renderItem={({ item }) => {
                if (item.data.senderID === auth?.currentUser?.uid) {
                  return (
                    <View key={item.id} style={styles.sender}>
                      <Avatar
                        rounded
                        position="absolute"
                        bottom={-15}
                        right={-5}
                        size={30}
                        source={{
                          uri:
                            auth?.currentUser?.photoURL ||
                            "https://cdn.britannica.com/56/199056-050-CCC44482/Jeff-Bezos-2017.jpg",
                        }}
                      />
                      <Text style={styles.senderText}>{item.data.message}</Text>
                    </View>
                  );
                } else {
                  return (
                    <View key={item.id} style={styles.reciever}>
                      <Avatar
                        rounded
                        position="absolute"
                        bottom={-15}
                        left={-5}
                        size={30}
                        source={{
                          uri:
                            props.route.params.photo ||
                            "https://upload.wikimedia.org/wikipedia/commons/8/85/Elon_Musk_Royal_Society_%28crop1%29.jpg",
                        }}
                      />
                      <Text style={styles.recieverText}>
                        {item.data.message}
                      </Text>
                    </View>
                  );
                }
              }}
              inverted={true}
            />
            <View style={styles.footer}>
              <TextInput
                style={styles.textInput}
                placeholder="Text me"
                onChangeText={(msg) => setMsg(msg)}
                value={msg}
              />
              <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
                <Avatar
                  rounded
                  source={{
                    uri: "https://image.flaticon.com/icons/png/512/3682/3682321.png",
                  }}
                />
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
};

export default ConvoScreen;
