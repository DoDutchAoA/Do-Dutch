import React, { Component } from "react";
import {
  AppRegistry,
  SectionList,
  StyleSheet,
  Text,
  View,
  ScrollView
} from "react-native";

import { Button, CheckBox } from "react-native-elements";

export default class FriendList extends Component {
  constructor() {
    super();

    // window.user_id = 2;

    this.state = {
      user_id: -1,
      type: "",
      friendsData: [],
      checked: {}
    };
  }

  componentDidMount() {
    this.loadFriendsData(this.props.type);
  }

  componentDidUpdate() {
    if (this.state.user_id === this.props.user_id) {
      return;
    }

    this.loadFriendsData(this.props.type);
  }

  changeType(newType) {
    this.setState({ type: newType });
  }

  toggleCheckBox(friend_id) {
    checked = JSON.parse(JSON.stringify(this.state.checked)); //copy the array
    checked[friend_id] = !checked[friend_id]; //execute the manipulations
    this.props.passCheckedValue(checked);
    console.log(checked);
    this.setState({ checked: checked });
  }

  loadFriendsData(type) {
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
        this.state.type = type;
        if (type === "select") {
          var checked = {};
          for (title in responseData) {
            for (index in responseData[title]) {
              checked[responseData[title][index]["friend_id"]] = false;
            }
          }
          this.state.checked = checked;
        }
        this.setState({ user_id: this.props.user_id });
      })
      .catch(error => {
        console.error("Error: friend list fetch error." + error);
      });
  }

  removeFriend(friend_id, friend_name) {
    fetch("http://52.12.74.177:5000/removeFriend", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        first_id: this.state.user_id,
        second_id: friend_id
      })
    })
      .then(response => {
        if (JSON.parse(response._bodyText)["status"] === true) {
          alert("Delete friend " + friend_name);
          this.loadFriendsData("delete");
        } else {
          alert("Fail to delete friend " + friend_name);
        }
      })
      .catch(error => {
        console.error("Error: friend list fetch error." + error);
      });
  }

  loadDeleteFriendButton() {
    if (this.state.type === "list") {
      return (
        <Button
          onPress={() => {
            this.changeType("delete");
          }}
          icon={{ name: "clear" }}
          buttonStyle={{
            backgroundColor: "#F5B7B1",
            width: 370,
            height: 45,
            borderColor: "transparent",
            borderWidth: 2,
            borderRadius: 7
          }}
          titleStyle={{ fontWeight: "700" }}
          title="Delete Friend"
        />
      );
    } else if (this.state.type === "delete") {
      return (
        <Button
          onPress={() => {
            this.changeType("list");
          }}
          icon={{ name: "remove" }}
          buttonStyle={{
            backgroundColor: "#D5D8DC",
            width: 370,
            height: 45,
            borderColor: "transparent",
            borderWidth: 2,
            borderRadius: 7
          }}
          titleStyle={{ fontWeight: "700" }}
          title="Completed"
        />
      );
    }
  }

  _renderItem = ({ item, section }) => {
    if (this.state.type === "list") {
      return (
        <View>
          <Text key={item.user_id} style={styles.item}>
            {item.friend_name}
          </Text>
        </View>
      );
    } else if (this.state.type === "delete") {
      return (
        <View>
          <Text
            onPress={() => {
              this.removeFriend(item.friend_id, item.friend_name);
            }}
            key={item.user_id}
            style={styles.item}
          >
            {item.friend_name}
          </Text>
        </View>
      );
    } else if (this.state.type === "select") {
      return (
        <View>
          <CheckBox
            title={item.friend_name}
            checked={this.state.checked[item.friend_id]}
            onPress={() => this.toggleCheckBox(item.friend_id)}
          />
        </View>
      );
    }
  };

  loadAllFriends() {
    return (
      <View>
        <SectionList
          sections={this.state.friendsData}
          renderItem={this._renderItem}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionHeader}>{section.title}</Text>
          )}
        />
      </View>
    );
  }

  render() {
    return (
      <View>
        {this.loadDeleteFriendButton()}
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
