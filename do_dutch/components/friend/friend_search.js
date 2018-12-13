import React, { Component } from "react";
import {
  AppRegistry,
  FlatList,
  StyleSheet,
  Text,
  View,
  ScrollView
} from "react-native";

import { Button, CheckBox, SearchBar } from "react-native-elements";

export default class FriendSearch extends Component {
  constructor() {
    super();

    // window.user_id = 22;

    this.state = {
      usersData: []
    };
  }

  addFriend(friend_id) {
    if (window.user_id == -1) {
      alert("You haven't log in. Please log in first.");
    }
  }

  loadUserList(keyword) {
    fetch("http://52.12.74.177:5000/searchUserByUsername", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        keyword: keyword
      })
    })
      .then(response => {
        var data = [];
        var responseData = JSON.parse(response._bodyText);
        this.setState({ usersData: responseData });
      })
      .catch(error => {
        console.error("Error: friend list fetch error." + error);
      });
  }

  render() {
    return (
      <View>
        <SearchBar
          lightTheme
          onChangeText={text => this.loadUserList(text)}
          // onClear={() => someMethod}
          placeholder="Type Here..."
        />

        <FlatList
          data={this.state.usersData}
          renderItem={({ item }) => (
            <Text
              onClick={() => this.addFriend(item.user_id)}
              style={styles.item}
            >
              {item.user_name}
            </Text>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: "bold",
    backgroundColor: "rgba(247,247,247,1.0)"
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44
  }
});
