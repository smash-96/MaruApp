import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  Button,
  Alert,
  TouchableOpacity,
  Dimensions,
  Modal,
  Image,
} from "react-native";
import { Avatar, Icon } from "react-native-elements";
import { auth, db } from "../../../firebase/firebaseConfig";
import { copyDoc, moveDoc } from "../../../firebase/firebaseUtil";
import firestore from "@react-native-firebase/firestore";
import HelpForm from "../HelpDetailForm/HelpForm";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";
import Map from "../../Custom/Map";
import { useSelector, useDispatch } from "react-redux";
import {
  selectUserType,
  selectUserLocation,
  selectHelperLocation,
  setHelperLocation,
  selectHelpeeLocation,
  setHelpeeLocation,
} from "../../../slices/userInfoSlice";
import {
  setActiveRequestData,
  selectActiveRequestData,
} from "../../../slices/helpRequestSlice";
import uuid from "react-native-uuid";
import haversine from "haversine";

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE = 31.552094953842936;
const LONGITUDE = 74.34618461877108;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const DEFAULT_PADDING = { top: 40, right: 40, bottom: 120, left: 40 };
const userID = auth?.currentUser?.uid;

const MapScreen = () => {
  const dispatch = useDispatch();
  const userType = useSelector(selectUserType);
  const helpeeLocation = useSelector(selectHelpeeLocation);
  const helperLocation = useSelector(selectHelperLocation);
  const activeRequestData = useSelector(selectActiveRequestData);

  const [needHelp, setNeedHelp] = useState(true);
  const [giveHelp, setGiveHelp] = useState(true);
  const [helpeeModalOpen, setHelpeeModalOpen] = useState(false);
  const [helperModalOpen, setHelperModalOpen] = useState(false);

  const [tracking, setTracking] = useState(false);

  const [helperModalData, setHelperModalData] = useState(null);

  const [refresh, doRefresh] = useState(0);

  const navigation = useNavigation();
  const [t_id, setT_id] = useState(null);

  useEffect(() => {
    const cRef = db.collection("requests");
    const requestDelete = cRef.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type == "removed") {
          clearRequest();
        }
      });
    });
    return requestDelete;
  });

  useEffect(() => {
    const cRef = db.collection("requests").doc(userID);

    const unsubscribe = cRef.onSnapshot(async (snapshot) => {
      const data = await snapshot.data();

      if (data && data.status === "InProgress") {
        //2nd corrdinate set for helpee
        dispatch(
          setHelperLocation({
            latitude: data?.locationHelper?.latitude,
            longitude: data?.locationHelper?.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          })
        );
        setT_id(data?.helperID);

        const requestData = {
          ...activeRequestData,
          helperID: data?.helperID,
          status: "InProgress",
          locationHelper: helperLocation,
        };
        dispatch(setActiveRequestData(requestData));
        // let hName = (
        //   await db.collection("Users").doc(data.helperID).get()
        // ).data().fname;
        // Alert.alert(
        //   "Help Request Accepted!",
        //   hName + " has agreed to help you. He'll be here shortly!"
        // );
        console.log("Help Accepted");
        // set for helpee
        setGiveHelp(false);
      }
    });

    return unsubscribe;
  }, []);

  // const simulatedGetMapRegion = () => ({
  //   latitude: LATITUDE,
  //   longitude: LONGITUDE,
  //   latitudeDelta: LATITUDE_DELTA,
  //   longitudeDelta: LONGITUDE_DELTA,
  // });

  const broadcastRequest = async (request) => {
    const requestData = {
      helpeeID: userID,
      helperID: null,
      status: "open",
      locationHelpee: helpeeLocation,
      locationHelper: null,
    };
    dispatch(setActiveRequestData(requestData));
    const cRef = db.collection("requests").doc(userID);
    cRef.set({
      helpeeID: userID,
      subject: request.subject || "NA",
      details: request.details || "NA",
      status: "open",
      locationHelpee: helpeeLocation,
      //locationHelpee: simulatedGetMapRegion(),
      ttl: request.time || "NA", // How soon does the helpee need help. E.g: within an hour
      timeStamp: firestore.FieldValue.serverTimestamp(),
    });
    // db.collection("Users")
    //   .doc(userID)
    //   .update({
    //     helpRequestData: {
    //       occupied: true,
    //       requestID: userID,
    //     },
    //   });
    Alert.alert(
      "Request Sent!",
      "Your request is broadcasted. We'll let you know if some one decides to aid you!"
    );
    setNeedHelp(false);
    setHelpeeModalOpen(false);
  };

  const helpeeAction = async () => {
    console.log("Need Help?");
    if (needHelp === true) {
      setHelpeeModalOpen(true);
    } else {
      // cancel button function
      Alert.alert("Request Cancelled!", "You cancelled the request");

      clearRequest();
    }
  };

  const helperAction = async () => {
    console.log("Give Help?");
    if (giveHelp === true) {
      const requests = await db.collection("requests");
      requests
        .get()
        .then((querySnapshot) => {
          const tempDoc = [];
          querySnapshot.forEach((doc) => {
            tempDoc.push({ id: doc.id, ...doc.data() });
          });

          if (tempDoc.length !== 0) {
            for (let i = 0; i < tempDoc.length; i++) {
              if (tempDoc[i].status === "open") {
                // const start = {
                //   latitude: simulatedGetMapRegion().latitude,
                //   longitude: simulatedGetMapRegion().longitude,
                // };
                const start = {
                  latitude: helperLocation.latitude,
                  longitude: helperLocation.longitude,
                };

                const end = {
                  latitude: tempDoc[i].locationHelpee.latitude,
                  longitude: tempDoc[i].locationHelpee.longitude,
                };
                let distance = haversine(start, end, {
                  unit: "meter",
                });
                console.log("Distance", distance);
                if (distance <= 10000) {
                  setHelperModalData(tempDoc[i]);
                  setHelperModalOpen(true);
                  break;
                }
                // else {
                //   Alert.alert(
                //     "No Request Available",
                //     "No help request is available in the system right now."
                //   );
                // }
              } else {
                Alert.alert(
                  "No Request Available",
                  "No help request is available in the system right now."
                );
              }
            }
          } else {
            Alert.alert(
              "No Request Available",
              "No help request is available in the system right now."
            );
          }
        })
        .catch((err) => {
          console.log("Error", err);
        });
    } else {
      Alert.alert(
        "Request Cancelled",
        "You have cancelled your request to help."
      );

      // set for helper
      clearRequest();
    }
  };

  const acceptRequest = async () => {
    const requestData = {
      helpeeID: helperModalData.helpeeID,
      helperID: userID,
      status: "open",
      locationHelpee: helperModalData.locationHelpee,
      locationHelper: helperLocation,
    };
    dispatch(setActiveRequestData(requestData));

    const requests = await db.collection("requests");
    if (
      (await requests.doc(helperModalData.id).get()).data().status !=
      "InProgress"
    ) {
      requests.doc(helperModalData.id).update({
        helperID: userID,
        status: "InProgress",
        locationHelper: helperLocation,
        initialHelperLocation: helperLocation,
        //locationHelper: simulatedGetMapRegion(),
      });
      setT_id(helperModalData.helpeeID); // set helpee ID for helper to delete
      accept(helperModalData);
    } else {
      Alert.alert(
        "Request Not Available",
        "Someone else agreed to help this person. Kindly try again!"
      );
    }

    setHelperModalOpen(false);
  };

  const accept = async (reqDoc) => {
    console.log("Request Accepted");
    //2nd corrdinate set for helper
    dispatch(
      setHelpeeLocation({
        latitude: reqDoc.locationHelpee.latitude,
        longitude: reqDoc.locationHelpee.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      })
    );

    // Alert.alert(
    //   "Request Accepted",
    //   "You have accepted to help someone in need."
    // );
    // set for helper
    setGiveHelp(false);
    setNeedHelp(false);
  };

  const clearRequest = async () => {
    await stateCleanUp();
    await firestoreCleanUp();
  };

  const stateCleanUp = async () => {
    if (userType === "helper") {
      dispatch(setHelpeeLocation(null));
    } else if (userType === "helpee") {
      dispatch(setHelperLocation(null));
    }
    dispatch(setActiveRequestData(null));
    setNeedHelp(true);
    setGiveHelp(true);
  };

  const firestoreCleanUp = async () => {
    let cRef;
    //cRef = db.collection("requests").doc(t_id);
    if (userType === "helper") {
      cRef = db.collection("requests").doc(t_id);
      if (cRef) {
        //await cRef.delete();
        await moveDoc(
          "requests",
          t_id,
          `CompletedRequests/${t_id}/AllRequests`,
          null,
          uuid.v4()
        );
      }
    } else if (userType === "helpee") {
      cRef = db.collection("requests").doc(userID);
      if (cRef) {
        //await cRef.delete();
        await moveDoc(
          "requests",
          userID,
          `CompletedRequests/${userID}/AllRequests`,
          null,
          uuid.v4()
        );
      }
    }
  };

  const enterChat = async () => {
    const docData = await db.collection("Users").doc(t_id).get();
    if (docData) {
      navigation.navigate("Messages", {
        screen: "ConvoScreen",
        params: {
          id: t_id,
          uid: t_id,
          fname: docData?.data()?.fname,
          lname: docData?.data()?.lname,
          photo: docData?.data()?.photoUrl,
        },
      });

      // await copyDoc("Users", t_id, `Chats/${userID}/SelectedChats`, null, t_id);
      await copyDoc(
        "Users",
        t_id,
        `Chats/${userID}/SelectedChats`,
        { lastMessageTime: firestore.FieldValue.serverTimestamp() },
        t_id
      );
    } else {
      console.log("Data Fetch Error from Firebase!");
    }
  };

  const startNavigation = async () => {
    console.log("Start Navigation");

    if (!tracking) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setTracking(true);
    } else {
      setTracking(false);
    }
  };

  return (
    <View>
      <Modal transparent={true} visible={helpeeModalOpen}>
        <View>
          <HelpForm
            onSubmit={(request) => broadcastRequest(request)}
            onClose={() => setHelpeeModalOpen(false)}
          />
        </View>
      </Modal>
      <Modal transparent={true} visible={helperModalOpen}>
        <View>
          <HelpForm
            onSubmit={acceptRequest}
            onClose={() => {
              setHelperModalData(null);
              setHelperModalOpen(false);
            }}
            data={helperModalData}
          />
        </View>
      </Modal>
      <TouchableOpacity
        onPress={() => navigation.toggleDrawer()}
        style={tw`bg-gray-100 absolute top-8 left-6 z-50 p-3 rounded-full shadow-lg`}
      >
        <Icon name="menu" />
      </TouchableOpacity>
      <View style={tw`h-full`}>
        <Map tracking={tracking} refresh={refresh} />
      </View>

      <TouchableOpacity
        style={{
          position: "absolute",
          top: 0,
          right: 0,
        }}
        onPress={() => doRefresh((prev) => prev + 1)}
      >
        <Image source={require("../../../assets/greenIndicator.png")} />
      </TouchableOpacity>

      <View
        style={{
          position: "absolute", //use absolute position to show button on top of the map
          bottom: 10,
          alignItems: "center",
          width: "100%",
        }}
      >
        {userType !== "helper" ? (
          <Button
            title={needHelp === true ? "Need Help?" : "Cancel Request"}
            onPress={helpeeAction}
          />
        ) : (
          <Button
            title={giveHelp === true ? "Give Help?" : "Cancel Help"}
            onPress={helperAction}
          />
        )}
        {/* {helperLocation && helpeeLocation && userType === "helper" && (
          <Button
            title={tracking === false ? "Start Navigation" : "Stop Navigation"}
            onPress={startNavigation}
          />
        )} */}
      </View>
      <View
        style={{
          position: "absolute", //use absolute position to show button on top of the map
          bottom: 20,
          left: "40%",
        }}
      >
        {needHelp === false && giveHelp === false ? (
          <TouchableOpacity
            onPress={enterChat}
            style={{
              alignSelf: "flex-end",
              bottom: 50,
              right: 20,
            }}
          >
            <Avatar
              rounded
              size={60}
              source={{
                uri: "https://365psd.com/images/istock/previews/1063/106340965-chat-icon-vector-blue.jpg",
              }}
            />
          </TouchableOpacity>
        ) : (
          <View></View>
        )}
      </View>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({});
