import React, { Component } from "react";
import { AppRegistry, Image } from "react-native";
import { Platform, StyleSheet, Text, View, TextInput } from "react-native";
import {
  Button,
  FormLabel,
  FormInput,
  FormValidationMessage
} from "react-native-elements";

// const fetch = require("node-fetch");


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
      <View style={styles.container}>
        <Text style={styles.text}> Log In </Text>
        <FormLabel> Username </FormLabel>
        <FormInput
          id="username"
          style={styles.input}
          autoFocus={true}
          keyboardType="email-address"
          value={this.state.username}
          onChangeText={text => this.setState({ username: text })}
        />

        <FormLabel color="#232323"> Password </FormLabel>
        <FormInput
          id="password"
          autoFocus={true}
          secureTextEntry={true}
          value={this.state.password}
          onChangeText={text => this.setState({ password: text })}
        />

        <Button
          large
          backgroundColor="#8e44ad"
          icon={{ name: "envira", type: "font-awesome" }}
          onPress={this.userLogIn}
          title="login"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 23
  },
  input: {
    margin: 15,
    height: 40,
    borderColor: "#7a42f4",
    borderWidth: 1
  },
  text: {
    color: "#566573",
    fontSize: 35,
    fontWeight: "bold"
  },
  capitalLetter: {
    color: "#2C3E50",
    fontSize: 25,
    fontStyle: "italic"
  }
});
