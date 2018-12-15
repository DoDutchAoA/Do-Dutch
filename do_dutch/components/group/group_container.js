import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Image } from "react-native";
import { StackNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation";

import GroupMain from "./group_main.js";
import GroupCreate from "./group_create.js";
import GroupDetail from "./group_detail.js";
import GroupAddMembers from "./group_add_members.js";
import GroupChat from "./group_chat.js";

export default class GroupContainer extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <GroupStackNavigator
        screenProps={this.props.navigation.getParam("user_id", -1)}
      />
    );
  }
}

const GroupStackNavigator = createStackNavigator({
  GroupMain: {
    screen: GroupMain,
    navigationOptions: ({ navigation }) => ({
      headerTitle: (
        <Text
          style={{
            fontFamily: "sans-serif-condensed",
            textAlign: "center",
            width: "100%",
            fontSize: 24
          }}
        >
          G o &nbsp;&nbsp; D u t c h
        </Text>
      )
    })
  },
  GroupCreate: {
    screen: GroupCreate,
    navigationOptions: ({ navigation }) => ({
      title: "Create New Group",
      headerTitleStyle: {
        color: "#17202a",
        textAlign: "center",
        fontFamily: "Montserrat-Regular"
      },
      headerStyle: {
        backgroundColor: "#d5d8dc",
        textAlign: "center"
      }
    })
  },
  GroupDetail: {
    screen: GroupDetail,
    navigationOptions: ({ navigation }) => ({
      title: "Group Detail",
      headerTitleStyle: {
        color: "#17202a",
        textAlign: "center",
        fontFamily: "Montserrat-Regular"
      },
      headerStyle: {
        backgroundColor: "#d5d8dc",
        textAlign: "center"
      }
    })
  },
  GroupAddMembers: {
    screen: GroupAddMembers,
    navigationOptions: ({ navigation }) => ({
      title: "Add Members",
      headerTitleStyle: {
        color: "#17202a",
        textAlign: "center",
        fontFamily: "Montserrat-Regular"
      },
      headerStyle: {
        backgroundColor: "#d5d8dc",
        textAlign: "center"
      }
    })
  },
  GroupChat: {
    screen: GroupChat,
    navigationOptions: ({ navigation }) => ({
      title: "Group Chat",
      headerTitleStyle: {
        color: "#17202a",
        textAlign: "center",
        fontFamily: "Montserrat-Regular"
      },
      headerStyle: {
        backgroundColor: "#d5d8dc",
        textAlign: "center"
      }
    })
  }
});
