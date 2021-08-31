import React, { useLayoutEffect, useState, useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  FlatList,
  NativeModules,
  LayoutAnimation,
  UIManager,
} from "react-native";
import Button from "react-native-button";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CustomList } from "../../../Custom/CustomList";
import dynamicStyles from "./styles";
import { Avatar, Icon } from "react-native-elements";
import { auth, db } from "../../../../firebase/firebaseConfig";
import messaging from "@react-native-firebase/messaging";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { selectConnecting } from "../../../../slices/userInfoSlice";
import { useDispatch, useSelector } from "react-redux";
//import tw from "tailwind-react-native-classnames";

//const { LaunchManager } = NativeModules;

// if (Platform.OS === "android") {
//   if (UIManager.setLayoutAnimationEnabledExperimental) {
//     UIManager.setLayoutAnimationEnabledExperimental(true);
//   }
// }

const ChatScreen = (props) => {
  const navigation = useNavigation();
  const [chats, setChats] = useState([]);
  const styles = dynamicStyles();

  const connecting = useSelector(selectConnecting);

  // My changes
  useEffect(() => {
    const unsubscribe = db
      .collection("Chats")
      .doc(auth?.currentUser?.uid)
      .collection("SelectedChats")
      .orderBy("lastMessageTime", "desc")
      .onSnapshot((snapshot) => {
        // LayoutAnimation.configureNext({
        //   duration: 50,
        //   create: {
        //     type: LayoutAnimation.Types.easeInEaseOut,
        //     property: LayoutAnimation.Properties.opacity,
        //   },
        //   update: { type: LayoutAnimation.Types.easeInEaseOut },
        // });

        setChats(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      });

    return unsubscribe;
  }, []);
  //

  useLayoutEffect(() => {
    props.navigation.setOptions({
      title: "MARU Chat",
      headerStyle: { backgroundColor: "#2c88d1" },
      headerTitleStyle: { color: "white" },
      headerLeft: () => (
        <View style={{ marginLeft: 20 }}>
          <TouchableOpacity
            onPress={() => navigation.toggleDrawer()}
            activeOpacity={0.5}
          >
            <Icon name="menu" />
          </TouchableOpacity>

          {/* <TouchableOpacity
            onPress={() => navigation.toggleDrawer()}
            style={tw`bg-gray-100 absolute top-16 left-8 z-50 p-3 rounded-full shadow-lg`}
          >
            <Icon name="menu" />
          </TouchableOpacity> */}
        </View>
      ),
      headerRight: () => (
        <View style={{ marginRight: 20 }}>
          <TouchableOpacity>
            <Avatar
              rounded
              source={require("../../../../assets/MessageLogo.png")}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const enterChat = (id, uid, fname, lname, photo) => {
    props.navigation.navigate("ConvoScreen", {
      id: id,
      uid: uid,
      fname: fname,
      lname: lname,
      photo: photo,
    });
  };

  // Listener for audio/video calls
  useEffect(() => {
    const unsubscribe = db.collection("Users").onSnapshot((snapshot) => {
      snapshot.forEach((user) => {
        const chatID = () => {
          const chatterID = auth?.currentUser?.uid;
          const chateeID = user.data().uid;
          const chatIDpre = [];
          chatIDpre.push(chatterID);
          chatIDpre.push(chateeID);
          chatIDpre.sort();
          return chatIDpre.join("_");
        };

        const cRef = db.collection("meet").doc(chatID());

        cRef.onSnapshot(async (snapshot) => {
          const data = snapshot.data();

          // If there is offer for chatId, set the getting call flag
          if (
            data &&
            data.offer &&
            !connecting &&
            data.chatType === "video" &&
            (
              await db.collection("Users").doc(auth?.currentUser?.uid).get()
            ).data()?.connection !== "close"
          ) {
            //
            db.collection("Users")
              .doc(auth?.currentUser?.uid)
              .update({ connection: "close" });
            //

            navigation.navigate("VideoChat", {
              callee: auth?.currentUser?.uid,
              caller: user.data().uid,
              photo: user.data().photoUrl,
            });
          }

          if (data && data.offer && !connecting && data.chatType === "audio") {
            navigation.navigate("AudioChat", {
              callee: auth?.currentUser?.uid,
              caller: user.data().uid,
              photo: user.data().photoUrl,
            });
          }
        });
      });
    });

    return unsubscribe;
  }, []);

  return (
    <SafeAreaProvider style={{ backgroundColor: "#effdff" }}>
      <FlatList
        data={chats}
        renderItem={({ item }) => (
          <CustomList
            key={item.id}
            id={item.id}
            uid={item.data.uid}
            fname={item.data.fname}
            lname={item.data.lname}
            photo={item.data.photoUrl}
            enterChat={enterChat}
          />
        )}
      />
    </SafeAreaProvider>
  );
};

export default ChatScreen;
