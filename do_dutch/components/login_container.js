import React, { Component } from "react";
import { AppRegistry, Image } from "react-native";
import { Platform, StyleSheet, Text, View } from "react-native";

import Signup from "./login/signup.js";
import Login from "./login/login.js";
import Logout from "./login/logout.js";

export default class LoginContainer extends Component {
  constructor() {
    super();

    this.state = {
      auth_type: "login"
    };
  }

  updateLogin = (id, name) => {
    window.user_id = id;
    window.username = name;
    this.setState({ auth_type: "logout" });
  };

  updateLogout = () => {
    window.user_id = undefined;
    window.username = undefined;
    this.setState({ auth_type: "login" });
  };

  userAuthentication() {
    if (window.user_id != undefined || this.state.auth_type == "logout") {
      return <Logout updateLogout={this.updateLogout} />;
    } else if (this.state.auth_type == "login") {
      return (
        <View>
          <Login updateLogin={this.updateLogin} />
          <View style={styles.textSection}>
            <Text
              onPress={() => {
                this.toggleLoginSignup();
              }}
            >
              {" "}
              *Not have an account?{" "}
              <Text style={{ color: "#8e44ad" }}>Sign up</Text> here.{" "}
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <View>
          <Signup updateLogin={this.updateLogin} />
          <View style={styles.textSection}>
            <Text
              onPress={() => {
                this.toggleLoginSignup();
              }}
            >
              {" "}
              *Already have an account?{" "}
              <Text style={{ color: "#E74C3C" }}>Click here</Text> to login.{" "}
            </Text>
          </View>
        </View>
      );
    }
  }

  toggleLoginSignup() {
    if (this.state.auth_type == "login") {
      this.setState({ auth_type: "signup" });
    } else {
      this.setState({ auth_type: "login" });
    }
  }

  alterOptionContent() {
    if (this.state.auth_type == "login") {
      return "Doesn't have an account? Sign up here.";
    } else {
      return "Already have an account? Click here to login.";
    }
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "stretch"
        }}
      >
        {this.userAuthentication()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textSection: {
    justifyContent: "center",
    alignItems: "center"
  }
});
