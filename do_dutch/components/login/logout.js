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
        <View style={styles.textSection}>
          <Text style={styles.text}> Hi Dutcher! </Text>
        </View>
        <View style={styles.buttonSection}>
          <Button
            large
            buttonStyle={{
              backgroundColor: "#52BE80",
              width: 380,
              height: 100,
              borderColor: "transparent",
              borderWidth: 15,
              borderRadius: 30
            }}
            icon={{
              name: "lock"
            }}
            onPress={this.props.updateLogout}
            title="Log out"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    color: "#566573",
    fontSize: 35,
    fontWeight: "bold"
  },
  textSection: {
    position: "absolute",
    bottom: 100,
    width: "100%",
    height: "30%",
    justifyContent: "center",
    alignItems: "center"
  },
  buttonSection: {
    top: 100
  }
});
