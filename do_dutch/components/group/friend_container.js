import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Image } from "react-native";

export default class FriendContainer extends Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    return (
      <View>
        <Text> Do Dutch </Text>

        {this.userAuthentication()}

        <Text
          onPress={() => {
            this.toggleLoginSignup();
          }}
        >
          {" "}
          {this.alterOptionContent()}{" "}
        </Text>
      </View>
    );
  }
}
