import React, { useEffect } from "react";
import { Image, Text, View, TextInput, Alert } from "react-native";
import Authentication_Button from "../../Custom/AuthenticationButton";
import { SocialIcon } from "react-native-elements";
import { Container, Content } from "native-base";
import dynamic_styles from "./LoginStyles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { auth } from "../../../firebase/firebaseConfig";
import I18n from "../../../localization/utils/language";
//import MapStack from "../../../navigations/MapStack";

import { Formik } from "formik";
import * as yup from "yup";

const loginSchema = yup.object({
  email: yup
    .string()
    .required("Email cannot be empty")
    .matches(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Email not valid"
    ),
  pass: yup.string().required("Password cannot be empty").min(8),
});

const Login = (props) => {
  const styles = dynamic_styles();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        props.navigation.replace("MapStack");
        //props.navigation.replace("MapScreen");
        //console.log(authUser);
      }
    });

    return unsubscribe;
  }, []);

  const login = (values, actions) => {
    console.log("LOGIN");
    auth
      .signInWithEmailAndPassword(values.email, values.pass)
      .then(() => {
        console.log("User account created & signed in!");
        //Alert.alert("Logged in!", "User signed in!");
        //props.navigation.navigate("Home");
      })
      .catch((error) => {
        if (error.code === "auth/invalid-email") {
          console.log("That email address is invalid!");
          //Alert.alert("Invalid email!", "That email address is invalid!");
        }

        console.error(error);
        //Alert.alert("Error", "An error has occurred. Please try again!");
      });

    //actions.resetForm();
  };

  const signup = () => {
    props.navigation.navigate("Signup");
  };

  return (
    <KeyboardAwareScrollView>
      <Container>
        <Content
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          {/* Footer Image */}
          <View style={styles.footerImage}>
            <Image source={require("../../../assets/footLogin.png")} />
          </View>
          {/* Logo at the top  */}
          <Image
            source={require("../../../assets/Logo.png")}
            style={styles.logo}
          />

          <Formik
            initialValues={{ email: "", pass: "" }}
            validationSchema={loginSchema}
            onSubmit={login}
          >
            {(formikProps) => (
              <>
                <TextInput
                  style={styles.txtInput}
                  placeholder={I18n.t("login.emailPlaceholder")}
                  type="email"
                  onChangeText={formikProps.handleChange("email")}
                  onBlur={formikProps.handleBlur("email")}
                  value={formikProps.values.email}
                  keyboardType="email-address"
                />
                {/* <Text style={styles.error}>
                  {formikProps.touched.email && formikProps.errors.email}
                </Text> */}

                <TextInput
                  style={styles.txtInput}
                  placeholder={I18n.t("login.passPlaceholder")}
                  type="password"
                  secureTextEntry={true}
                  onChangeText={formikProps.handleChange("pass")}
                  value={formikProps.values.pass}
                />

                {/* <Text style={styles.error}>
                  {formikProps.touched.pass && formikProps.errors.pass}
                </Text> */}

                <View style={styles.authenticationButton}>
                  <Authentication_Button
                    title={I18n.t("login.login")}
                    backGroundColor={"#2c88d1"}
                    textColor={"#FFFFFF"}
                    borderColor={"#2c88d1"}
                    handlePress={formikProps.handleSubmit}
                  />
                </View>
              </>
            )}
          </Formik>

          <View style={styles.authenticationButton}>
            <Authentication_Button
              title={I18n.t("login.signup")}
              backGroundColor={"#FFFFFF"}
              textColor={"#2c88d1"}
              borderColor={"#2c88d1"}
              handlePress={signup}
            />
          </View>

          <Text>- {I18n.t("login.or")} -</Text>
          <Text>{I18n.t("login.atext")} </Text>

          {/* Google logo for sign in */}
          <SocialIcon
            raised={true}
            type="google"
            style={{ backgroundColor: "#2c88d1" }}
          />
        </Content>
      </Container>
    </KeyboardAwareScrollView>
  );
};

export default Login;
