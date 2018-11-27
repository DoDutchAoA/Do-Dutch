import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList
} from "react-native";

import { Button } from "react-native-elements";

export default class GroupDetail extends Component {
  constructor() {
    super();

    this.state = {
      group_id: -1,
      group_name: "",
      groupsData: []
    };
  }

  componentDidMount() {
    this.loadGroupsData();
  }

  componentDidUpdate() {
    if (
      this.state.group_id === this.props.navigation.getParam("group_id", -1)
    ) {
      return;
    }

    this.loadGroupsData();
  }

  loadGroupsData() {
    this.state.group_id = this.props.navigation.getParam("group_id", -1);
    this.state.group_name = this.props.navigation.getParam("group_name", "");

    fetch("http://52.12.74.177:5000/getAllMembersByGroupId", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        group_id: this.state.group_id
      })
    })
      .then(response => {
        console.log(response._bodyText);
        this.setState({ groupsData: JSON.parse(response._bodyText) });
      })
      .catch(error => {
        console.error("Error: group list fetch error." + error);
      });
  }

  render() {
    return (
      <View>
        <Text> Group name: {this.state.group_name} </Text>

        <View>
          <FlatList
            data={this.state.groupsData}
            renderItem={({ item }) => (
              <Text style={styles.item} key={item.member_id}>
                {item.member_name}
              </Text>
            )}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44
  }
});
