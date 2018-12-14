import React, { Component } from "react";
import { AppRegistry, Image } from "react-native";
import { Platform, StyleSheet, Text, View, TextInput } from "react-native";
import {
  Button,
  FormLabel,
  FormInput,
  FormValidationMessage
} from "react-native-elements";

export default class Signup extends Component {
  constructor() {
    super();

    this.state = {
      username: "",
      password: ""
    };
  }

  userSignUp() {
    if (this.state.password != this.state.password_confirm) {
      alert("Password not match!");
      return;
    }

    fetch("http://52.12.74.177:5000/signUp", {
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
        this.props.updateLogin(response._bodyText, this.state.username);
      })
      .catch(error => {
        console.error("Error: signup fetch error." + error);
      });
  }

  render() {
    return (
      <View>
        <Text style={styles.text}> Sign Up </Text>

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

        <FormLabel> Re-enter password </FormLabel>
        <FormInput
          autoFocus={true}
          keyboardType="password"
          value={this.state.password_confirm}
          onChangeText={text => this.setState({ password_confirm: text })}
        />

        <Button
          icon={{ name: "user", type: "font-awesome" }}
          backgroundColor="#E74C3C"
          onPress={e => this.userSignUp(e)}
          title="Sign Up"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    color: "#1F618D",
    fontSize: 35,
    fontWeight: "bold"
  }
});
