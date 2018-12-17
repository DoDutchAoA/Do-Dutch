import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Image } from "react-native";
import {
  Button,
  FormLabel,
  FormInput,
  FormValidationMessage
} from "react-native-elements";

import FriendList from "../friend/friend_list.js";

export default class GroupMemberSelect extends Component {
  constructor() {
    super();

    this.state = {
      group_name: "",
      user_id: window.user_id,
      checked: {}
    };
  }

  setCheckedValue = checked => {
    this.props.setCheckedValue(checked);
  };

  render() {
    return (
      <View>
        <FriendList
          user_id={window.user_id}
          type="select"
          passCheckedValue={this.setCheckedValue}
        />
      </View>
    );
  }
}
