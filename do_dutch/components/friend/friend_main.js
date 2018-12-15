import React, { Component } from "react";
import { AppRegistry, SectionList, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements";

import FriendList from "./friend_list.js";
import FriendSearch from "./friend_search.js";

export default class FriendMain extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <View>
        <FriendList user_id={this.props.screenProps} type="list" />
        <View style={styles.buttonSection}>
          <Button
            onPress={() => {
              this.props.navigation.navigate("FriendSearch");
            }}
            icon={{ name: "search", type: "font-awesome" }}
            buttonStyle={{
              backgroundColor: "#3498DB",
              width: 150,
              height: 60,
              borderColor: "transparent",
              borderWidth: 6,
              borderRadius: 100
            }}
            titleStyle={{ fontWeight: "700" }}
            title="Search"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonSection: {
    position: "absolute",
    top: 360,
    width: "100%",
    height: "30%",
    justifyContent: "center",
    alignItems: "center"
  }
});
