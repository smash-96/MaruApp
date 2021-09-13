import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { auth } from "../../firebase/firebaseConfig";
import MapView, {
  Marker,
  AnimatedRegion,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";
import { getCurrentLocation } from "../../components/Utils/locationHelper";
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
const LATITUDE = 31.552094953842936;
const LONGITUDE = 74.34618461877108;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const DEFAULT_PADDING = { top: 200, right: 40, bottom: 220, left: 40 };
const userID = auth?.currentUser?.uid;

const Map = () => {
  const dispatch = useDispatch();
  const helpeeLocation = useSelector(selectHelpeeLocation);
  const helperLocation = useSelector(selectHelperLocation);
  const userType = useSelector(selectUserType);
  const currentUser = useSelector(selectUserData);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const mapRef = useRef();
  const markerRef = useRef();

  useEffect(() => {
    if (helperLocation && helpeeLocation) return;
    if (currentUser?.user?.location) {
      setLatitude(currentUser.user.location.latitude);
      setLongitude(currentUser.user.location.longitude);

      if (userType === "helper") {
        //1st corrdinate set for helper
        dispatch(
          setHelperLocation({
            latitude: currentUser.user.location.latitude,
            longitude: currentUser.user.location.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          })
        );
      } else if (userType === "helpee") {
        //1st corrdinate set for helpee
        dispatch(
          setHelpeeLocation({
            latitude: currentUser.user.location.latitude,
            longitude: currentUser.user.location.longitude,
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

  const getLiveLocation = async () => {
    // Tracking needed only for helper
    if (userType === "helper") {
      const location = await getCurrentLocation();
      console.log("Get Live Location", location);
      animate(location);
      dispatch(
        setHelperLocation({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        })
      );

      // Setting these so marker doesn't return to initial stage after person has stopped moving
      setLatitude(location.latitude);
      setLongitude(location.longitude);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getLiveLocation();
    }, 4000);

    return () => clearInterval(interval);
  });

  const animate = ({ latitude, longitude }) => {
    const newCoordinate = { latitude, longitude };
    if (Platform.OS == "android") {
      if (markerRef.current) {
        markerRef.current.animateMarkerToCoordinate(newCoordinate, 5000);
      }
    } else {
      coordinate.timing(newCoordinate).start();
    }
  };

  const onCenter = () => {
    mapRef.current.animateToRegion({
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
  };

  const getMapRegion = () => ({
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const helperMapRegion = () =>
    new AnimatedRegion({
      latitude: helperLocation.latitude,
      longitude: helperLocation.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });

  const helpeeMapRegion = () => ({
    latitude: helpeeLocation.latitude,
    longitude: helpeeLocation.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  // const simulatedGetMapRegion = () => ({
  //   latitude: LATITUDE,
  //   longitude: LONGITUDE,
  //   latitudeDelta: LATITUDE_DELTA,
  //   longitudeDelta: LONGITUDE_DELTA,
  // });

  //show on simulator
  if (loading === false && Constants.isDevice === false) {
    return (
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={getMapRegion()}
        //region={helpeeMapRegion()}
        //showsUserLocation={true}
      >
        {helperLocation && helpeeLocation && (
          <MapViewDirections
            origin={helperLocation}
            destination={helpeeLocation}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={3}
            strokeColor="black"
            onStart={(params) => {
              console.log("onStart", params);
            }}
            onReady={(result) => {
              mapRef.current.fitToCoordinates(result.coordinates, {
                edgePadding: {},
              });
            }}
            onError={(err) => {
              console.log("MapViewDirections Error", err);
            }}
          />
        )}
        {helperLocation?.latitude && helperLocation?.longitude && (
          <Marker.Animated
            ref={markerRef}
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
              latitude: helpeeMapRegion().latitude,
              longitude: helpeeMapRegion().longitude,
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
        initialRegion={getMapRegion()}
        // initialRegion={
        //   userType === "helper" ? helperMapRegion() : helpeeMapRegion()
        // }
        //showsUserLocation={true}
      >
        {helperLocation && helpeeLocation && (
          <MapViewDirections
            origin={helperLocation}
            destination={helpeeLocation}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={3}
            strokeColor="black"
            //optimizeWaypoints={true}
            resetOnChange={false}
            onStart={(params) => {
              console.log("onStart", params);
            }}
            onReady={(result) => {
              mapRef.current.fitToCoordinates(result.coordinates, {
                edgePadding: {},
              });
            }}
            onError={(err) => {
              console.log("MapViewDirections Error", err);
            }}
          />
        )}
        {helperLocation?.latitude && helperLocation?.longitude && (
          <Marker.Animated
            ref={markerRef}
            // coordinate={{
            //   latitude: helperLocation.latitude,
            //   longitude: helperLocation.longitude,
            // }}
            coordinate={helperMapRegion()}
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

  if (loading === true) {
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
