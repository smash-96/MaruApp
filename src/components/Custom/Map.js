import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { auth } from "../../firebase/firebaseConfig";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";
import useLocation from "../Custom/useLocation";
import Constants from "expo-constants";
//import tw from "tailwind-react-native-classnames";
import { useSelector, useDispatch } from "react-redux";
import {
  setUserLocation,
  selectUserType,
  selectHelpeeLocation,
  selectHelperLocation,
  setHelpeeLocation,
  setHelperLocation,
} from "../../slices/userInfoSlice";
import { selectUserData } from "../../slices/userAuthSlice";
import { GOOGLE_MAPS_APIKEY } from "@env";

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE = 31.529279325357457;
const LONGITUDE = 74.34901334345341;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const DEFAULT_PADDING = { top: 200, right: 40, bottom: 120, left: 40 };
const userID = auth?.currentUser?.uid;

const Map = (props) => {
  const dispatch = useDispatch();
  const helpeeLocation = useSelector(selectHelpeeLocation);
  const helperLocation = useSelector(selectHelperLocation);
  const userType = useSelector(selectUserType);
  const currentUser = useSelector(selectUserData);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [zoom, setZoom] = useState(false);
  const [movingHelperLocation, setMovingHelperLocation] = useState(null);
  const mapRef = useRef();

  useEffect(() => {
    if (helperLocation && helpeeLocation) return;

    if (currentUser?.user?.location) {
      setLatitude(currentUser.user.location.latitude);
      setLongitude(currentUser.user.location.longitude);

      console.log("Initial lat long values", latitude, longitude);

      dispatch(
        setUserLocation({
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        })
      );

      if (userType === "helper") {
        //1st corrdinate set for helper
        dispatch(
          setHelperLocation({
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          })
        );
      } else if (userType === "helpee") {
        //1st corrdinate set for helpee
        dispatch(
          setHelpeeLocation({
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          })
        );
      }

      setLoading(false);
      setErrorMsg(null);
    } else {
      console.log("Location fetching error");
      if (userType === "helper") {
        //1st corrdinate set for helper in simulator
        dispatch(
          setHelperLocation({
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          })
        );
      } else if (userType === "helpee") {
        //1st corrdinate set for helpee in simulator
        dispatch(
          setHelpeeLocation({
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          })
        );
      }
      //setErrorMsg(err);
    }
  }, [loading]);

  const callback = useCallback((location) => {
    //console.log("CALLBACK LOCATION", location);
    //dispatch(setHelperLocation(location.coords));
    setLatitude(location.coords.latitude);
    setLongitude(location.coords.longitude);
  }, []);

  const [error] = useLocation(props.tracking, callback);

  // useEffect(() => {
  //   if (!helperLocation || !helpeeLocation) return;
  //   // Zoom to fit markers
  //   // mapRef.current.fitToCoordinates([
  //   //   {
  //   //     latitude: helperLocation.latitude,
  //   //     longitude: helperLocation.longitude,
  //   //   },
  //   //   {
  //   //     latitude: helpeeLocation.latitude,
  //   //     longitude: helpeeLocation.longitude,
  //   //   },
  //   // ]);
  //   // try {
  //   //   if (mapRef.current) {
  //   //     mapRef.current.fitToSuppliedMarkers([
  //   //       "helperLocation",
  //   //       "helpeeLocation",
  //   //     ]);
  //   //     console.log("fitToSuppliedMarkers");
  //   //   }
  //   // } catch (err) {
  //   //   console.log("Marker Error", err);
  //   // }

  //   mapRef.current.fitToSuppliedMarkers(["helperLocation", "helpeeLocation"], {
  //     edgePadding: DEFAULT_PADDING,
  //     animated: true,
  //   });

  //   //setZoom(true);
  // }, [helperLocation, helpeeLocation]);

  // const fitAllMarkers = () => {
  //   try {
  //     if (mapRef.current) {
  //       console.log("FIT Marker", coordinates.current);
  // mapRef.current.fitToCoordinates(
  //   [
  //     { latitude: 31.5113059, longitude: 74.354887 },
  //     { latitude: 31.56192, longitude: 74.348083 },
  //   ],
  //         //coordinates.current,
  //         {
  //           edgePadding: DEFAULT_PADDING,
  //           animated: true,
  //         }
  //       );
  //       setZoom(true);
  //     }
  //   } catch (e) {
  //     console.log("Marker Error", e);
  //   }
  // };

  const getMapRegion = () => ({
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const simulatedGetMapRegion = () => ({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  //show on simulator
  if (Constants.isDevice === false) {
    return (
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={simulatedGetMapRegion()}
        //showsUserLocation={true}
      >
        {helperLocation && helpeeLocation && (
          <MapViewDirections
            origin={helperLocation}
            destination={helpeeLocation}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={3}
            strokeColor="black"
          />
        )}
        {helperLocation?.latitude && helperLocation?.longitude && (
          <Marker
            // coordinate={{
            //   latitude: simulatedGetMapRegion().latitude,
            //   longitude: simulatedGetMapRegion().longitude,
            // }}
            coordinate={{
              latitude: helperLocation.latitude,
              longitude: helperLocation.longitude,
            }}
            title="Helper"
            description={"I am coming to help you!"}
            identifier="helperLocation"
          />
        )}
        {helpeeLocation?.latitude && helpeeLocation?.longitude && (
          <Marker
            // coordinate={{
            //   latitude: helpeeLocation.latitude,
            //   longitude: helpeeLocation.longitude,
            // }}
            coordinate={{
              latitude: simulatedGetMapRegion().latitude,
              longitude: simulatedGetMapRegion().longitude,
            }}
            title="Helpee"
            description={"I need help!"}
            identifier="helpeeLocation"
          />
        )}
      </MapView>
    );
  }

  // show on real device
  if (loading === false && Constants.isDevice === true) {
    return (
      <MapView
        ref={mapRef}
        //provider={PROVIDER_GOOGLE}
        //style={tw`flex-1`}
        style={styles.map}
        region={getMapRegion()}
        //showsUserLocation={true}
      >
        {helperLocation && helpeeLocation && (
          <MapViewDirections
            origin={helperLocation}
            destination={helpeeLocation}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={3}
            strokeColor="black"
          />
        )}
        {helperLocation?.latitude && helperLocation?.longitude && (
          <Marker
            // coordinate={{
            //   latitude: helperLocation.latitude,
            //   longitude: helperLocation.longitude,
            // }}
            coordinate={getMapRegion()}
            title="Helper"
            description={"I am coming to help you!"}
            identifier="helperLocation"
          />
        )}
        {helpeeLocation?.latitude && helpeeLocation?.longitude && (
          <Marker
            coordinate={{
              latitude: helpeeLocation.latitude,
              longitude: helpeeLocation.longitude,
            }}
            title="Helpee"
            description={"I need help!"}
            identifier="helpeeLocation"
          />
        )}
      </MapView>
    );
  }

  if (loading === true && Constants.isDevice === true) {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Loading...</Text>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
};

export default Map;

const mapStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

// const styles = StyleSheet.create({
//   container: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     alignItems: "center",
//     justifyContent: "flex-end",
//   },
//   mapStyle: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },
// });

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: "stretch",
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: "center",
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    marginVertical: 20,
    backgroundColor: "transparent",
  },
});
