import React, { Component } from "react";
import {
  AppRegistry,
  FlatList,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert
} from "react-native";
import Dialog from "react-native-dialog";
import { Button, CheckBox, SearchBar } from "react-native-elements";

export default class FriendSearch extends Component {
  constructor() {
    super();

    // window.user_id = 22;

    this.state = {
      usersData: []
    };
  }

  addFriend(friend_name, friend_id) {
    if (friend_id == window.user_id) {
      alert("cannot add yourself.");
      return;
    }

    fetch("http://52.12.74.177:5000/addFriend", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        first_id: window.user_id,
        second_id: friend_id
      })
    })
      .then(response => {
        var data = [];
        var responseData = JSON.parse(response._bodyText);
        if (responseData["status"] == true) {
          alert(friend_name + " is your friend now.");
        } else {
          alert("Fail to add " + friend_name + " as your friend.");
        }
      })
      .catch(error => {
        console.error("Error: friend list fetch error." + error);
      });
  }

  addFriendConfirm(friend_name, friend_id) {
    if (window.user_id == undefined || window.user_id == -1) {
      alert("You haven't log in. Please log in first.");
    }

    Alert.alert(
      "Do you want to add " + friend_name + " as your friend?",
      "",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => this.addFriend(friend_name, friend_id) }
      ],
      { cancelable: false }
    );
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
        if (responseData.length > 0) {
          this.setState({ usersData: responseData });
        }
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
              onPress={() =>
                this.addFriendConfirm(item.user_name, item.user_id)
              }
              key={item.user_id}
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
