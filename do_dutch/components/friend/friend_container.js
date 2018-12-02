import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Image } from "react-native";
import { StackNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation";

import FriendMain from "./friend_main.js";

export default class FriendContainer extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <FriendStackNavigator
        screenProps={this.props.navigation.getParam("user_id", -1)}
      />
    );
  }
}

const FriendStackNavigator = createStackNavigator({
  FriendMain: {
    screen: FriendMain,
    navigationOptions: ({ navigation }) => ({
      title: "Friends",
      headerTitleStyle: {
        color: "#17202a",
        textAlign: "center",
        fontFamily: "Montserrat-Regular"
      },
      headerStyle: {
        backgroundColor: "#d5d8dc",
        textAlign: "center"
      }
    })
  }
});
