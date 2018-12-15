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
      <View style={styles.container}>
        <View>
          <Text style={styles.text}> Log In </Text>
        </View>
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
          buttonStyle={{
            backgroundColor: "#8e44ad",
            width: 380,
            height: 100,
            borderColor: "transparent",
            borderWidth: 15,
            borderRadius: 30
          }}
          icon={{ name: "person" }}
          onPress={e => this.userLogIn()}
          titleStyle={{
            fontWeight: "700",
            fontSize: 10,
            fontFamily: "MarkPro Medium"
          }}
          title="Log in"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 15
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
    fontWeight: "bold",
    top: 15,
    left: 15
  },
  capitalLetter: {
    color: "#2C3E50",
    fontSize: 25,
    fontStyle: "italic"
  }
});
