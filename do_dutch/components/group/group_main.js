import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Image } from "react-native";

import { Button } from "react-native-elements";

export default class GroupMain extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <View>
        <Text> Group Main </Text>
        <Button
          onPress={() => {
            this.props.navigation.navigate("GroupCreate");
          }}
          title="Create a new group"
        />
      </View>
    );
  }
}
