import React, { Component } from "react";
import { AppRegistry, Image } from "react-native";
import { Platform, StyleSheet, Text, View, TextInput } from "react-native";
import {
  Button,
  FormLabel,
  FormInput,
  FormValidationMessage
} from "react-native-elements";

export default class LogIn extends Component {
  constructor() {
    super();

    this.state = {
      username: "",
      password: ""
    };
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
        if (response._bodyText == "-1") {
          alert("Wrong password!");
        } else {
          this.props.updateLogin(response._bodyText, this.state.username);
        }
      })
      .catch(error => {
        console.error("Error: login fetch error." + error);
      });
  }

  render() {
    return (
      <View>
        <Text> Log In </Text>

        <FormLabel> Username </FormLabel>
        <FormInput
          autoFocus={true}
          keyboardType="email-address"
          value={this.state.username}
          onChangeText={text => this.setState({ username: text })}
        />

        <FormLabel> Password </FormLabel>
        <FormInput
          autoFocus={true}
          keyboardType="password"
          value={this.state.password}
          onChangeText={text => this.setState({ password: text })}
        />

        <Button onPress={e => this.userLogIn()} title="login" />
      </View>
    );
  }
}
