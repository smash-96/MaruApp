import React, { useState, useLayoutEffect, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Avatar, Button } from "react-native-elements";
import UserAvatar from "../../Custom/UserAvatar/UserAvatar";
import { Container, Content } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { auth, db } from "../../../firebase/firebaseConfig";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import dynamic_styles from "./styles";
import { useDispatch } from "react-redux";
import {
  setUserType,
  setUserPhoto,
  setUserFname,
  setUserLname,
  setUserAddress,
  setUserGender,
  setUserAge,
} from "../../../slices/userInfoSlice";
import { useSelector } from "react-redux";
import {
  selectUserPhoto,
  selectUserType,
  selectUserFname,
  selectUserLname,
  selectUserAddress,
  selectUserGender,
  selectUserAge,
} from "../../../slices/userInfoSlice";
import { useNavigation } from "@react-navigation/native";
import Picker from "../../Custom/Picker";
import { Icon } from "react-native-elements";

const ProfileScreen = () => {
  // console.disableYellowBox = true;
  const styles = dynamic_styles();
  const dispatch = useDispatch();
  const userPhoto = useSelector(selectUserPhoto);
  const userType = useSelector(selectUserType);
  const userFname = useSelector(selectUserFname);
  const userLname = useSelector(selectUserLname);
  const userAddress = useSelector(selectUserAddress);
  const userGender = useSelector(selectUserGender);
  const userAge = useSelector(selectUserAge);
  const navigation = useNavigation();

  const baseAvatar =
    "https://www.iosapptemplates.com/wp-content/uploads/2019/06/empty-avatar.jpg";
  const [image, setImage] = useState(baseAvatar || "");
  const [profilePic, setProfilePic] = useState(baseAvatar || "");
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  const [fname, setFname] = useState(null);
  const [lname, setLname] = useState(null);
  const [address, setAddress] = useState(null);
  const [age, setAge] = useState(null);
  const options_gender = [
    <Text style={styles.action_sheet}>Male</Text>,
    <Text style={styles.action_sheet}>Female</Text>,
    <Text style={{ fontWeight: "bold" }}>Cancel</Text>,
  ];
  const options_type = [
    <Text style={styles.action_sheet}>helper</Text>,
    <Text style={styles.action_sheet}>helpee</Text>,
    <Text style={{ fontWeight: "bold" }}>Cancel</Text>,
  ];
  const [gender_placeHolder, set_gender_placeHolder] = useState([
    "Select your gender",
  ]);
  const [type_placeHolder, set_type_placeHolder] = useState([
    "Select your type",
  ]);

  const [gender, setGender] = useState("");
  const [uType, setUType] = useState("");

  const getPickerValues = (index, picker_type) => {
    if (picker_type == "gender") {
      if (index == 0) {
        setGender("Male");
      } else {
        setGender("Female");
      }
      set_gender_placeHolder(null);
    } else {
      if (index == 0) {
        setUType("helper");
      } else {
        setUType("helpee");
      }
      set_type_placeHolder(null);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "MARU Profile",
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
              source={require("../../../assets/MessageLogo.png")}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (userPhoto !== null) {
      setProfilePic(userPhoto);
    }
  }, [userPhoto, profilePic]);

  const setProfilePicture = (img) => {
    setImage(img);
  };

  useEffect(() => {
    setFname(userFname);
    setLname(userLname);
    setAddress(userAddress);
    setGender(userGender);
    setAge(userAge);
    setUType(userType);
  }, []);

  const uploadImage = async () => {
    if (image != baseAvatar) {
      const pathToFile = image;
      console.log("pathToFile", pathToFile);
      let filename = pathToFile.substring(pathToFile.lastIndexOf("/") + 1);

      // Add timestamp to File Name
      const extension = filename.split(".").pop();
      const name = filename.split(".").slice(0, -1).join(".");
      filename = name + Date.now() + "." + extension;

      //setUploading(true);
      setTransferred(0);

      const reference = storage().ref(filename);
      const task = reference.putFile(pathToFile);

      task.on("state_changed", (taskSnapshot) => {
        console.log(
          `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`
        );

        setTransferred(
          Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
            100
        );
      });

      try {
        await task;
        const url = await reference.getDownloadURL();

        //setUploading(false);
        setImage(baseAvatar);

        // Alert.alert(
        //   'Image uploaded!',
        //   'Your image has been uploaded to the Firebase Cloud Storage Successfully!',
        // );
        return url;
      } catch (error) {
        console.log(error);
        return null;
      }
    } else {
      return null;
    }
  };

  const submit = async () => {
    setUploading(true);
    const cRef = db.collection("Users").doc(auth?.currentUser?.uid);
    cRef.update({
      fname: fname,
      lname: lname,
      Address: address,
      Gender: gender,
      Age: age,
      userType: uType,
    });

    dispatch(setUserFname(fname));
    dispatch(setUserLname(lname));
    dispatch(setUserAddress(address));
    dispatch(setUserGender(gender));
    dispatch(setUserAge(age));
    dispatch(setUserType(uType));

    let photoUrl;
    if (image !== baseAvatar) {
      photoUrl = await uploadImage();
      if (photoUrl != null) {
        cRef.update({
          photoUrl: photoUrl,
        });
        dispatch(setUserPhoto(photoUrl));

        auth.currentUser.updateProfile({ photoURL: photoUrl });
      }
    }
    setUploading(false);
  };

  //
  return (
    <KeyboardAwareScrollView
      style={{ paddingTop: "10%", backgroundColor: "#effdfe" }}
    >
      <View>
        {/* PROFILE PICTURE */}
        <UserAvatar
          setProfilePicture={setProfilePicture}
          profilePic={profilePic}
        />
        <View>
          {/* First Name */}
          <View style={styles.singleRow}>
            <Text style={styles.left_fields}>First Name</Text>

            <TextInput
              style={styles.fields}
              onChangeText={(val) => setFname(val)}
              value={fname}
              //defaultValue={userFname}
              placeholder="John"
            />
          </View>

          <View style={styles.singleRow}>
            {/* Last Name */}
            <Text style={styles.left_fields}>Last Name</Text>

            <TextInput
              style={styles.fields}
              onChangeText={(val) => setLname(val)}
              value={lname}
              //defaultValue={userLname}
              placeholder="Doe"
            />
          </View>
          {/* 
          <View style={styles.singleRow}>
            <Text style={styles.left_fields}>Email</Text>

            <TextInput
              style={styles.fields}
              onChangeText={(val) => setEmail(val)}
              value={email}
              defaultValue={userEmail}
              placeholder="me@gmail.com"
            />
          </View> */}

          <View style={styles.singleRow}>
            {/* Address  */}
            <Text style={styles.left_fields}>Address</Text>
            {userAddress !== null ? (
              <TextInput
                style={styles.fields}
                onChangeText={(val) => {
                  setAddress(val);
                }}
                value={address}
                //defaultValue={userAddress}
                placeholder="Address"
              />
            ) : (
              <TextInput
                style={styles.fields}
                onChangeText={(val) => {
                  setAddress(val);
                }}
                value={address}
                placeholder="Address"
              />
            )}
          </View>

          {/* Gender */}
          <View style={styles.singleRow}>
            <Text style={styles.left_fields}>Gender</Text>

            <Picker
              myValue={gender}
              getValues={getPickerValues}
              options={options_gender}
              title={"gender"}
              myplaceholder={gender_placeHolder}
            />
          </View>
          <View style={styles.singleRow}>
            <Text style={styles.left_fields}>Age</Text>

            {userAge !== null ? (
              <TextInput
                style={styles.dob}
                onChangeText={(val) => {
                  setAge(val);
                }}
                value={age}
                //defaultValue={userAge}
                placeholder="Your Age"
                keyboardType="numeric"
              />
            ) : (
              <TextInput
                style={styles.dob}
                onChangeText={(val) => {
                  setAge(val);
                }}
                value={age}
                placeholder="Your Age"
                keyboardType="numeric"
              />
            )}

            {/* <TextInput style={styles.fields} placeholder="Your age" /> */}
          </View>
          <View style={styles.singleRow}>
            <Text style={styles.left_fields}>Select your type</Text>
            <Picker
              myValue={uType}
              getValues={getPickerValues}
              options={options_type}
              title={"type"}
              myplaceholder={type_placeHolder}
            />
          </View>
        </View>
        <View style={styles.submit}>
          {uploading === true ? (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>{transferred} % Completed</Text>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : (
            <Button
              containerStyle={{
                margin: "10%",

                borderRadius: 12,
                width: "30%",
              }}
              title="Update"
              onPress={submit}
            />
          )}
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default ProfileScreen;
