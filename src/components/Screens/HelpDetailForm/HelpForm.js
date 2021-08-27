import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import { Button, TextInput, View, Text } from "react-native";
import * as yup from "yup";
import { db } from "../../../firebase/firebaseConfig";
import { useSelector } from "react-redux";

import { selectUserType } from "../../../slices/userInfoSlice";
import UserAvatar from "../../Custom/UserAvatar/UserAvatar";
import dynamic_styles from "./styles";

const helpeeFieldsSchema = yup.object({
  //   title: yup.string().required().min(3),
  //   body: yup.string().required().min(8),
  //   rating: yup
  //     .string()
  //     .required()
  //     .test("is-rat-valid", "It should be between 1 - 5", (val) => {
  //       if (parseInt(val) > 0 && parseInt(val) < 6) {
  //         return true;
  //       }
  //       return false;
  //     }),

  subject: yup.string().required(),
  details: yup.string().required(),
  time: yup.string().required(),
});

const HelpForm = (props) => {
  const styles = dynamic_styles();
  const userType = useSelector(selectUserType);
  const baseAvatar =
    "https://www.iosapptemplates.com/wp-content/uploads/2019/06/empty-avatar.jpg";

  const [helpeeName, setHelpeeName] = useState(null);
  const [helpeePhoto, setHelpeePhoto] = useState(baseAvatar || "");
  const [helpeeSubject, setHelpeeSubject] = useState(null);
  const [helpeeDetails, setHelpeeDetails] = useState(null);
  const [helpeeTime, setHelpeeTime] = useState(null);

  if (userType === "helpee") {
    return (
      <View>
        <Formik
          initialValues={{ subject: "", details: "", time: "" }}
          //validationSchema={helpeeFieldsSchema}
          onSubmit={(values) => props.onSubmit(values)}
        >
          {(formikProps) => (
            <View>
              <TextInput
                style={styles.subject}
                placeholder="Subject"
                // automatically handles the state of the form
                onChangeText={formikProps.handleChange("subject")}
                value={formikProps.values.subject}
              />
              <TextInput
                multiline
                style={styles.details}
                placeholder="Details"
                onChangeText={formikProps.handleChange("details")}
                value={formikProps.values.details}
              />
              <TextInput
                style={styles.time}
                placeholder="Time"
                onChangeText={formikProps.handleChange("time")}
                value={formikProps.values.time}
                keyboardType="numeric"
              />
              <View style={styles.buttons}>
                <Button
                  title="Request Help!"
                  color="green"
                  onPress={formikProps.handleSubmit}
                />
                <Button title="Close" color="crimson" onPress={props.onClose} />
              </View>
            </View>
          )}
        </Formik>
      </View>
    );
  } else if (userType === "helper") {
    useEffect(() => {
      const getHelpeeData = async () => {
        let data;

        const cRef1 = db.collection("Users").doc(props.data.helpeeID);
        data = await cRef1.get();
        setHelpeeName(data.data().fname + " " + data.data().lname);
        setHelpeePhoto(data.data().photoUrl);

        const cRef2 = db.collection("requests").doc(props.data.helpeeID);
        data = await cRef2.get();
        setHelpeeSubject(data.data().subject);
        setHelpeeDetails(data.data().details);
        setHelpeeTime(data.data().ttl);
      };

      getHelpeeData();
    }, []);

    return (
      <View style={styles.container}>
        <Text>{helpeeName}</Text>
        <Text>{helpeeSubject}</Text>
        <Text>{helpeeDetails}</Text>
        <Text>{helpeeTime}</Text>
        <UserAvatar profilePic={helpeePhoto} drawer={true} />

        <View style={styles.buttons}>
          <Button
            title="Accept Request"
            color="green"
            onPress={props.onSubmit}
          />
          <Button title="Close" color="crimson" onPress={props.onClose} />
        </View>
      </View>
    );
  }
};

export default HelpForm;
