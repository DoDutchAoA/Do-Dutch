import React, { Component } from "react";
import { AppRegistry, Image } from "react-native";
import { Platform, StyleSheet, Text, View, TextInput } from "react-native";
import {
  Button,
  FormLabel,
  FormInput,
  FormValidationMessage
} from "react-native-elements";

export default class Logout extends Component {
  constructor() {
    super();
  }

  userLogIn() {
    fetch("http://52.12.74.177:5000/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        userpwd: this.state.password
      })
    })
      .then(response => {
        console.log(response);
        this.props.updateLogin(response._bodyText, this.state.username);
      })
      .catch(error => {
        console.error("Error: login fetch error." + error);
      });
  }

  render() {
    return (
      <View>
        <Text> Hi {window.username}! You already logged in. </Text>
        <Button onPress={this.props.updateLogout} title="Log out" />
      </View>
    );
  }
}
