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
          <Text
            onPress={() => {
              this.toggleLoginSignup();
            }}
          >
            {" "}
            Doesn't have an account? Sign up here.{" "}
          </Text>
        </View>
      );
    } else {
      return (
        <View>
          <Signup updateLogin={this.updateLogin} />
          <Text
            onPress={() => {
              this.toggleLoginSignup();
            }}
          >
            {" "}
            Already have an account? Click here to login.{" "}
          </Text>
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
      <View>
        <Text> Do Dutch </Text>

        {this.userAuthentication()}
      </View>
    );
  }
}
