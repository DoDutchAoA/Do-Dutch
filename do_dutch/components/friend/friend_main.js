import React, { Component } from "react";
import { AppRegistry, SectionList, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements";

import FriendList from "./friend_list.js";
import FriendSearch from "./friend_search.js";

export default class FriendMain extends Component {
  render() {
    return (
      <View>
        <Button
          onPress={() => {
            this.props.navigation.navigate("FriendSearch");
          }}
          title="Search friends"
        />

        <FriendList user_id={this.props.screenProps} type="list" />
      </View>
    );
  }
}
