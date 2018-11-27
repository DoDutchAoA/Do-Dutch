import React, { Component } from "react";
import {
  AppRegistry,
  SectionList,
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView
} from "react-native";

export default class FriendList extends Component {
  constructor() {
    super();

    this.state = {
      user_id: -1,
      friendsData: []
    };
  }

  componentDidUpdate() {
    if (this.state.user_id === this.props.user_id) {
      return;
    }

    fetch("http://52.12.74.177:5000/getAllFriends", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: this.props.user_id
      })
    })
      .then(response => {
        var data = [];
        var responseData = JSON.parse(response._bodyText);
        for (title in responseData) {
          var item = {};
          item["title"] = title;
          item["data"] = responseData[title];
          data.push(item);
        }
        this.state.friendsData = data;
        this.setState({ user_id: this.props.user_id });
      })
      .catch(error => {
        console.error("Error: friend list fetch error." + error);
      });
  }

  _renderItem = ({ item, section }) => (
    <Text key={item.user_id}>{item.friend_name}</Text>
  );

  loadAllFriends() {
    return (
      <View>
        <SectionList
          sections={this.state.friendsData}
          renderItem={this._renderItem}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionHeader}>{section.title}</Text>
          )}
          keyExtractor={(item, index) => index}
        />
      </View>
    );
  }

  render() {
    return (
      <View>
        <Text> friend list </Text>
        {this.loadAllFriends()}
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
