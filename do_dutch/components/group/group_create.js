import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Image } from "react-native";
import {
  Button,
  FormLabel,
  FormInput,
  FormValidationMessage
} from "react-native-elements";

import GroupMemberSelect from "./group_member_select.js";

export default class GroupCreate extends Component {
  constructor() {
    super();

    this.state = {
      group_name: "",
      user_id: window.user_id,
      checked: {}
    };
  }

  setCheckedValue = checked => {
    this.state.checked = checked;
  };

  createGroup() {
    if (this.state.group_name === "") {
      alert("Group name cannot be empty!");
      return;
    }

    var checked_friend_ids = [];

    for (friend_id in this.state.checked) {
      if (this.state.checked[friend_id]) {
        checked_friend_ids.push(parseInt(friend_id));
      }
    }

    console.log(checked_friend_ids);

    fetch("http://52.12.74.177:5000/createGroupWithMembers", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        groupName: this.state.group_name,
        ownerId: this.state.user_id,
        memberIds: checked_friend_ids
      })
    })
      .then(response => {
        if (response._bodyText === "-1") {
          alert("The group name already be used, plz try another name.");
        } else {
          alert("The group is create successfully.");
          this.props.navigation.navigate("GroupMain", { force_reload: 0 });
        }
      })
      .catch(error => {
        console.error("Error: group create error." + error);
      });
  }

  render() {
    return (
      <View>
        <FormLabel> Group name </FormLabel>
        <FormInput
          autoFocus={true}
          value={this.state.group_name}
          onChangeText={text => this.setState({ group_name: text })}
        />

        <Button onPress={e => this.createGroup()} title="Submit" />

        <GroupMemberSelect setCheckedValue={this.setCheckedValue} />
      </View>
    );
  }
}
