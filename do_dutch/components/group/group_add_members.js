import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Image } from "react-native";
import {
  Button,
  FormLabel,
  FormInput,
  FormValidationMessage
} from "react-native-elements";

import GroupMemberSelect from "./group_member_select.js";

export default class GroupAddMembers extends Component {
  constructor() {
    super();

    this.state = {
      user_id: window.user_id,
      checked: {}
    };
  }

  setCheckedValue = checked => {
    this.state.checked = checked;
  };

  addMembers() {
    var checked_friend_ids = [];

    for (friend_id in this.state.checked) {
      if (this.state.checked[friend_id]) {
        checked_friend_ids.push(parseInt(friend_id));
      }
    }

    console.log(checked_friend_ids);

    fetch("http://52.12.74.177:5000/addMembersToGroup", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        groupId: this.props.navigation.getParam("group_id", -1),
        memberIds: checked_friend_ids
      })
    })
      .then(response => {
        alert("Complete update!");
        this.props.navigation.navigate("GroupDetail", { force_reload: 0 });
      })
      .catch(error => {
        console.error("Error: group create error." + error);
      });
  }

  render() {
    return (
      <View>
        <Button onPress={e => this.addMembers()} title="Submit" />

        <GroupMemberSelect setCheckedValue={this.setCheckedValue} />
      </View>
    );
  }
}
