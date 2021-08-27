import { StyleSheet } from "react-native";

const dynamicStyles = () => {
  return StyleSheet.create({
    subject: {
      borderWidth: 1,
      borderColor: "#ddd",
      padding: 10,
      fontSize: 18,
      borderRadius: 6,
      top: 10,
    },
    details: {
      borderWidth: 1,
      borderColor: "#ddd",
      padding: 10,
      fontSize: 18,
      borderRadius: 6,
      height: "50%",
      top: 20,
    },
    time: {
      borderWidth: 1,
      borderColor: "#ddd",
      padding: 10,
      fontSize: 18,
      borderRadius: 6,
      top: 30,
    },
    buttons: {
      top: 40,
    },
  });
};

export default dynamicStyles;
