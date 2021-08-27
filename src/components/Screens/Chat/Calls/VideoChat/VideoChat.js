import React, { useState, useRef, useEffect } from "react";
import { View, Alert, BackHandler } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
//import {Avatar} from 'react-native-elements';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  // RTCView,
  // MediaStream,
  // MediaStreamTrack,
  // mediaDevices,
  // registerGlobals,
} from "react-native-webrtc";
import InCallManager from "react-native-incall-manager";
import { auth, db } from "../../../../../firebase/firebaseConfig";
import { GettingCall } from "../GettingCall";
import { Video } from "./Video";
import Utils from "../Utils";
//import { toggleCall } from "../../redux/actions/call";
import {
  selectConnecting,
  setConnecting,
} from "../../../../../slices/userInfoSlice";
import { useDispatch, useSelector } from "react-redux";

//const configuration = {iceServers: [{url: 'stun:stun.l.google.com:19302'}]};
const API_URL =
  Platform.OS === "ios" ? "http://localhost:3000" : "http://10.0.2.2:3000";
const configuration = {
  iceServers: [
    {
      url: "stun:global.stun.twilio.com:3478?transport=udp",
      urls: "stun:global.stun.twilio.com:3478?transport=udp",
    },
    {
      url: "turn:global.turn.twilio.com:3478?transport=udp",
      username:
        "baad1f6b829eb7388d1004a6a6482ff5aad95d8a10e4960699457a2bf52c8793",
      urls: "turn:global.turn.twilio.com:3478?transport=udp",
      credential: "aJguY/fCjYWhb+MhzoDocDd289vU90rvOPif17gHHKg=",
    },
    {
      url: "turn:global.turn.twilio.com:3478?transport=tcp",
      username:
        "baad1f6b829eb7388d1004a6a6482ff5aad95d8a10e4960699457a2bf52c8793",
      urls: "turn:global.turn.twilio.com:3478?transport=tcp",
      credential: "aJguY/fCjYWhb+MhzoDocDd289vU90rvOPif17gHHKg=",
    },
    {
      url: "turn:global.turn.twilio.com:443?transport=tcp",
      username:
        "baad1f6b829eb7388d1004a6a6482ff5aad95d8a10e4960699457a2bf52c8793",
      urls: "turn:global.turn.twilio.com:443?transport=tcp",
      credential: "aJguY/fCjYWhb+MhzoDocDd289vU90rvOPif17gHHKg=",
    },
  ],
  // [
  //   {urls: 'stun:stun.services.mozilla.com'},
  //   {urls: 'stun:stun.l.google.com:19302'},
  //   {
  //     urls: 'turn:numb.viagenie.ca',
  //     username: 'maisamshah57@gmail.com',
  //     credential: 'QwertyDqcrg',
  //   },
  // ],
};
export const VideoChat = (props) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [gettingCall, setGettingCall] = useState(false);
  const pc = useRef();
  const isSpeaker = useRef(false);
  const isMuted = useRef(false);
  const nav = useRef(false);
  //let twilio_config;

  const dispatch = useDispatch();
  const connecting = useSelector(selectConnecting);

  // const dispatch = useDispatch();
  // const ToggleCall = (call) => dispatch(toggleCall(call));

  // maps the component state to redux state
  //const connecting = useSelector((state) => state.callReducer.connecting);
  if (props.route.params.caller === auth?.currentUser?.uid) {
    console.log("Start Connecting", connecting);
  }
  //

  //const wakeState = props.route.params.wakeState.current;
  // let connecting;
  // console.log('props.route.params.wakeState', props.route.params.wakeState);
  // if (props.route.params.wakeState) {
  //   connecting = props.route.params.wakeState;
  //   console.log('WakeState connecting', connecting);
  // } else {
  //   connecting = useSelector(state => state.callReducer.connecting);
  //   console.log('Normal connecting', connecting);
  // }

  // Get ICE servers from server
  // const node_func = () => {
  //   fetch(`${API_URL}/token`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then(async (res) => {
  //       try {
  //         const jsonRes = await res.json();
  //         console.log(jsonRes);
  //         return jsonRes;
  //       } catch (err) {
  //         console.log(err);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  //   return null;
  // };

  useEffect(() => {
    if (props.route.params.caller === auth?.currentUser?.uid) {
      // twilio_config = await node_func();
      // console.log('Create Connection for caller');
      // setTimeout(() => {
      //   create();
      // }, 3000);
      create();
    }
  }, []);

  useEffect(() => {
    const cRef = db.collection("meet").doc(chatID());

    const unsubscribe = cRef.onSnapshot((snapshot) => {
      const data = snapshot.data();

      // if (data && data.offer && !data.answer && nav.current) {
      //   if (props.route.params.caller === auth?.currentUser?.uid) {
      //     console.log('Busy Tone');
      //     InCallManager.stop({busytone: '_DTMF_'});
      //   }
      // }

      if (!data && nav.current) {
        // if (props.route.params.caller === auth?.currentUser?.uid) {
        //   InCallManager.stop({busytone: '_DTMF_'});
        // }
        props.navigation.goBack();
        db.collection("Users")
          .doc(props.route.params.caller)
          .update({ connection: "open" });
        db.collection("Users")
          .doc(props.route.params.callee)
          .update({ connection: "open" });
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const cRef = db.collection("meet").doc(chatID());

    const subscribe = cRef.onSnapshot(async (snapshot) => {
      const data = snapshot.data();

      // On answer start the call
      // Set Remote Description for Caller
      if (pc.current && !pc.current.remoteDescription && data && data.answer) {
        await pc.current.setRemoteDescription(
          new RTCSessionDescription(data.answer)
        );
        //InCallManager.stopRingback();
      }

      // If there is offer for chatId, set the getting call flag
      // The connecting variable will be true for the caller and so the getting call
      // component will be displayed to the calee as their connecting variable is still false
      if (
        data &&
        data.offer &&
        !connecting &&
        props.route.params.caller !== auth?.currentUser?.uid
      ) {
        setGettingCall(true);
      }
    });
    return subscribe;
  }, [connecting]);

  useEffect(() => {
    const cRef = db.collection("meet").doc(chatID());

    const calleeDelete = cRef.collection("callee").onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type == "removed") {
          // Busy tone heard by caller on hangup from callee
          if (
            props.route.params.caller === auth?.currentUser?.uid &&
            nav.current
          ) {
            console.log("Busy Tone", nav.current);
            //InCallManager.stop({busytone: '_DTMF_'});
          }
          //
          hangup();
        }
      });
    });

    return calleeDelete;
  });

  useEffect(() => {
    const cRef = db.collection("meet").doc(chatID());

    const callerDelete = cRef.collection("caller").onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type == "removed") {
          // Busy tone heard by caller on hangup from callee
          if (
            props.route.params.caller !== auth?.currentUser?.uid &&
            nav.current
          ) {
            console.log("Busy Tone", nav.current);
            //InCallManager.stop({busytone: '_DTMF_'});
          }
          //
          hangup();
        }
      });
    });

    return callerDelete;
  });

  //
  // useFocusEffect(
  //   React.useCallback(() => {
  //     const onBackPress = () => {
  //       //navigation.navigate('ThirdPage');
  //       // Return true to stop default back navigaton
  //       // Return false to keep default back navigaton
  //       return true;
  //     };

  //     // Add Event Listener for hardwareBackPress
  //     BackHandler.addEventListener('hardwareBackPress', onBackPress);

  //     return () => {
  //       // Once the Screen gets blur Remove Event Listener
  //       BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  //     };
  //   }, []),
  // );
  //

  const chatID = () => {
    const chatterID = props.route.params.caller;
    const chateeID = props.route.params.callee;
    const chatIDpre = [];
    chatIDpre.push(chatterID);
    chatIDpre.push(chateeID);
    chatIDpre.sort();
    return chatIDpre.join("_");
  };

  /*
   * On Android, the app is woken up when a remote message is received (background push notification), and it presents
   * the native calling screen. Once user accepts the native calling screen, the app becomes active, and we place the user
   * in the call directly. This is what this method does.
   * This method basically enables calls when screen is locked on Android.
   */

  const setupWebrtc = async () => {
    // const twilio_config = await node_func();
    // console.log('twilio_config', twilio_config);
    // if (twilio_config !== null) {
    //   pc.current = new RTCPeerConnection({
    //     iceServers: twilio_config.iceServers,
    //   });
    // } else {
    //   console.log('You Suck!');
    //   return;
    //   //pc.current = new RTCPeerConnection(configuration);
    // }
    pc.current = new RTCPeerConnection({
      iceServers: configuration.iceServers,
    });
    // Get the audio and video stream for the call
    const stream = await Utils.getStream("video");

    if (stream) {
      setLocalStream(stream);
      pc.current.addStream(stream);
    }

    // Get the remote stream once it is available
    pc.current.onaddstream = (event) => {
      setRemoteStream(event.stream);
    };
  };
  const create = async () => {
    // Check that current user is the caller
    if (props.route.params.caller === auth?.currentUser?.uid) {
      // Check that the calle is not in call with anyone else
      if (
        (
          await db.collection("Users").doc(props.route.params.callee).get()
        ).data()?.connection !== "close"
      ) {
        // Enter Function here
        console.log("Calling");
        // console.log(
        //   (
        //     await db.collection('Users').doc(props.route.params.callee).get()
        //   ).data()?.connection,
        // );
        dispatch(setConnecting(true));
        //ToggleCall(true);

        //setUp WebRtc
        await setupWebrtc();

        // Start call with tone heard by caller for caller
        //InCallManager.start({media: 'audio/video', ringback: '_DTMF_'});
        // InCallManager.setKeepScreenOn(true);
        // InCallManager.setForceSpeakerphoneOn(true);

        // Document for the call
        const cRef = db.collection("meet").doc(chatID());

        // Exchange the ICE candidates
        collectIceCandidates(cRef, "caller", "callee");
        // console.log('Create Issue');

        if (pc.current) {
          // Create the offer for the call
          // Store the offer under the document
          const offer = await pc.current.createOffer();
          await pc.current.setLocalDescription(offer);

          const cWithOffer = {
            offer: {
              sdp: offer.sdp,
              type: offer.type,
            },
          };

          cRef.set(cWithOffer);
        }
        cRef.update({
          chatType: "video",
          callerID: props.route.params.caller,
          calleeID: props.route.params.callee,
        });

        //
        db.collection("Users")
          .doc(props.route.params.caller)
          .update({ connection: "close" });
        //

        InCallManager.setForceSpeakerphoneOn(true);
      } else {
        // Condition handler when someone is calling the caller or callee of another call
        nav.current = true;
        Alert.alert("User Busy", "Call back later!");
      }
    }
  };

  const join = async () => {
    if (props.route.params.caller !== auth?.currentUser?.uid) {
      console.log("Joining the call");
      dispatch(setConnecting(true));
      //ToggleCall(true);
      //nav.current = true;
      setGettingCall(false);

      const cRef = db.collection("meet").doc(chatID());
      const offer = (await cRef.get()).data()?.offer;

      if (offer) {
        // setup webrtc
        await setupWebrtc();

        // Exchange ther ICE candidates
        // Check the parameters, Its reversed. Since the joining part is callee
        collectIceCandidates(cRef, "callee", "caller");

        if (pc.current) {
          // Set Remote Description for Callee
          await pc.current.setRemoteDescription(
            new RTCSessionDescription(offer)
          );

          // Create the answer for the call
          // Update the document with answer
          const answer = await pc.current.createAnswer();
          await pc.current.setLocalDescription(answer);

          const cWithAnswer = {
            answer: {
              sdp: answer.sdp,
              type: answer.type,
            },
          };
          cRef.update(cWithAnswer);
        }

        InCallManager.setForceSpeakerphoneOn(true);
      }
    }
  };

  //For disconnecting the call, close the connection, release the stream
  // and delete the document for the call
  const hangup = async () => {
    await streamCleanUp();
    await firestoreCleanUp();
    if (pc.current) {
      pc.current.close();
      pc.current = null;
    }

    setGettingCall(false);
    dispatch(setConnecting(false));
    //ToggleCall(false);
    nav.current = true;
  };

  // Helper Functions
  const streamCleanUp = async () => {
    if (localStream) {
      localStream.getTracks().forEach((t) => t.stop());
      localStream.release();
    }
    setLocalStream(null);
    setRemoteStream(null);
  };
  const firestoreCleanUp = async () => {
    const cRef = db.collection("meet").doc(chatID());

    if (cRef) {
      const calleeCandidate = await cRef.collection("callee").get();
      calleeCandidate.forEach(async (candidate) => {
        await candidate.ref.delete();
      });

      const callerCandidate = await cRef.collection("caller").get();
      callerCandidate.forEach(async (candidate) => {
        await candidate.ref.delete();
      });
      await cRef.delete();
    }
  };

  const collectIceCandidates = async (cRef, localName, remoteName) => {
    const candidateCollection = cRef.collection(localName);
    if (pc.current) {
      // On new ICE candidate add it to firestore
      pc.current.onicecandidate = (event) => {
        if (!event || !event.candidate) return;
        if (event.candidate) {
          candidateCollection.add(event.candidate);
        }
      };
    }

    // Get the ICE candidate added to firestore and update the local pc value
    cRef.collection(remoteName).onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type == "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          try {
            pc.current?.addIceCandidate(candidate);
          } catch (error) {
            console.log(error);
          }
        }
      });
    });
  };

  // Misc Functions

  const toggleSpeaker = () => {
    if (!remoteStream) return;
    isSpeaker.current = isSpeaker.current === true ? false : true;
    if (isSpeaker) {
      InCallManager.setForceSpeakerphoneOn(true);
    } else {
      InCallManager.setForceSpeakerphoneOn(null);
    }
  };

  const toggleMute = () => {
    if (!remoteStream) return;
    localStream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    isMuted.current = isMuted.current === true ? false : true;
  };

  // Displays the gettingCall Component
  if (gettingCall) {
    return (
      <GettingCall
        photo={props.route.params.photo}
        localStream={localStream}
        hangup={hangup}
        join={join}
      />
    );
  }

  // Displays local stream on Calling
  // Switches to display both local and remote stream once call is connected
  if (localStream) {
    return (
      <Video
        hangup={hangup}
        toggleSpeaker={toggleSpeaker}
        toggleMute={toggleMute}
        localStream={localStream}
        remoteStream={remoteStream}
      />
    );
  }

  return <View style={{ flex: 1, backgroundColor: "black" }}></View>;
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
