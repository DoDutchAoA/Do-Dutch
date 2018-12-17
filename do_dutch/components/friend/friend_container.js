import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Image } from "react-native";
import { StackNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation";

import FriendMain from "./friend_main.js";
import FriendSearch from "./friend_search.js";

export default class FriendContainer extends Component {
  constructor() {
    super();

    this.state = {
      update_token: 0
    };
  }

  render() {
    this.props.navigation.navigate("FriendMain");
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
      headerTitle: (
        <Text
          style={{
            fontFamily: "sans-serif-condensed",
            textAlign: "center",
            width: "100%",
            fontSize: 24
          }}
        >
          G o &nbsp;&nbsp; D u t c h
        </Text>
      )
    })
  },
  FriendSearch: {
    screen: FriendSearch,
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
