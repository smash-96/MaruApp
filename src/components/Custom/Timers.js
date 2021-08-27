import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

const Timers = () => {
  const [second, setSecond] = React.useState(0);
  const [minute, setMinute] = React.useState(0);
  const [hour, setHour] = React.useState(0);

  const [time, setTime] = React.useState();

  useEffect(() => {
    const interval = setInterval(() => {
      setSecond(second + 1);

      if (second != 0) {
        if (second % 60 == 0) {
          setMinute(minute + 1);
          setSecond(0);
        }
      }
      if (minute != 0) {
        if (minute % 60 == 0) {
          setMinute(0);
          setHour(hour + 1);
        }
      }
      if (second <= 60 && minute < 1) {
        if (second > 0 && second < 10) {
          var res = "00:0" + second;
        } else {
          var res = "00:" + second;
        }
      } else if (minute <= 60 && hour < 1) {
        if (minute > 0 && minute < 60) {
          if (second > 0 && second < 10) {
            var res = "0" + minute + ":0" + second;
          } else {
            var res = "0" + minute + ":" + second;
          }
        } else {
          var res = minute + ":" + second;
        }
      } else {
        var res = hour + ":" + minute + ":" + second;
      }
      setTime(res);
    }, 1000);
    return () => clearInterval(interval);
  }, [second]);

  return (
    <View
      style={{
        marginTop: "7.5%",
      }}
    >
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 18,
        }}
      >
        {time}
      </Text>
    </View>
  );
};

export default Timers;

const styles = StyleSheet.create({});
