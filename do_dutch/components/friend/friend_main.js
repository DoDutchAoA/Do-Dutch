import React, { Component } from "react";
import { AppRegistry, SectionList, StyleSheet, Text, View } from "react-native";

import FriendList from "./friend_list.js";

export default class FriendMain extends Component {
  render() {
    return (
      <View>
        <FriendList user_id={this.props.screenProps} type="list" />
      </View>
    );
  }
}
